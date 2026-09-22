#!/usr/bin/env python3

# CREDO_NETWORK_IMPORTER_V11_4

import argparse
import glob
import json
import os
import sqlite3
import time


parser = argparse.ArgumentParser(
    description="Importer danych sieci CREDO"
)

parser.add_argument(
    "--dir",
    default=os.path.join(
        os.environ.get(
            "CREDO_DATA_DIR",
            os.path.join(
                os.path.dirname(
                    os.path.dirname(
                        os.path.abspath(__file__)
                    )
                ),
                "data"
            )
        ),
        "credo-data-export"
    )
)

parser.add_argument(
    "--db",
    default=os.path.join(
        os.environ.get(
            "CREDO_DATA_DIR",
            os.path.join(
                os.path.dirname(
                    os.path.dirname(
                        os.path.abspath(__file__)
                    )
                ),
                "data"
            )
        ),
        "network.sqlite3"
    )
)

parser.add_argument(
    "--rebuild",
    action="store_true"
)

args = parser.parse_args()


def connect():

    con = sqlite3.connect(
        args.db,
        timeout=60
    )

    #
    # DELETE zamiast WAL:
    # network.sqlite3 ma być później bezproblemowo
    # czytelna dla usługi credo-analyzer bez
    # dodatkowych plików -wal/-shm należących do root.
    #
    con.execute(
        "PRAGMA journal_mode=DELETE"
    )

    con.execute(
        "PRAGMA synchronous=NORMAL"
    )

    return con


def schema(con):

    con.executescript("""
    CREATE TABLE IF NOT EXISTS network_detections(
        detection_id TEXT PRIMARY KEY,
        timestamp_ms INTEGER NOT NULL,
        time_received_ms INTEGER,
        device_id INTEGER,
        user_id INTEGER,
        team_id INTEGER,
        x INTEGER,
        y INTEGER,
        visible INTEGER,
        source TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_network_timestamp
    ON network_detections(timestamp_ms);

    CREATE INDEX IF NOT EXISTS idx_network_device
    ON network_detections(device_id);

    CREATE TABLE IF NOT EXISTS devices(
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        team_id INTEGER,
        device_type TEXT,
        device_model TEXT,
        system_version TEXT
    );

    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY,
        username TEXT,
        display_name TEXT
    );

    CREATE TABLE IF NOT EXISTS teams(
        id INTEGER PRIMARY KEY,
        name TEXT
    );

    CREATE TABLE IF NOT EXISTS import_files(
        path TEXT PRIMARY KEY,
        size INTEGER,
        mtime_ns INTEGER,
        imported_at INTEGER,
        rows_imported INTEGER
    );

    CREATE TABLE IF NOT EXISTS network_meta(
        key TEXT PRIMARY KEY,
        value TEXT
    );
    """)

    con.commit()


def load_json(path):

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as f:
        return json.load(f)


def extract_mapping_rows(obj, plural):

    if isinstance(obj, list):
        return obj

    if not isinstance(obj, dict):
        return []

    candidates = [
        plural,
        plural.rstrip("s"),
        "mapping",
        "data",
        "results"
    ]

    for key in candidates:

        value = obj.get(key)

        if isinstance(value, list):
            return value

        if isinstance(value, dict):

            if all(
                isinstance(v, dict)
                for v in value.values()
            ):
                return list(
                    value.values()
                )

    if obj and all(
        isinstance(v, dict)
        for v in obj.values()
    ):
        return list(
            obj.values()
        )

    return []


def first_id(row, kind):

    for key in (
        "id",
        kind + "_id"
    ):
        value = row.get(key)

        if value is not None:
            try:
                return int(value)
            except Exception:
                return None

    return None


def import_mapping(
    con,
    path,
    kind
):

    if not os.path.isfile(path):
        return 0

    obj = load_json(path)

    plural = kind + "s"

    rows = extract_mapping_rows(
        obj,
        plural
    )

    imported = 0

    if kind == "device":

        data = []

        for row in rows:

            if not isinstance(row, dict):
                continue

            rid = first_id(
                row,
                "device"
            )

            if rid is None:
                continue

            data.append(
                (
                    rid,
                    row.get("user_id"),
                    row.get("team_id"),
                    row.get("device_type"),
                    row.get("device_model"),
                    row.get("system_version")
                )
            )

        con.executemany(
            """
            INSERT OR REPLACE INTO devices(
                id,
                user_id,
                team_id,
                device_type,
                device_model,
                system_version
            )
            VALUES(?,?,?,?,?,?)
            """,
            data
        )

        imported = len(data)


    elif kind == "user":

        data = []

        for row in rows:

            if not isinstance(row, dict):
                continue

            rid = first_id(
                row,
                "user"
            )

            if rid is None:
                continue

            data.append(
                (
                    rid,
                    row.get("username"),
                    row.get("display_name")
                    or row.get("name")
                )
            )

        con.executemany(
            """
            INSERT OR REPLACE INTO users(
                id,
                username,
                display_name
            )
            VALUES(?,?,?)
            """,
            data
        )

        imported = len(data)


    elif kind == "team":

        data = []

        for row in rows:

            if not isinstance(row, dict):
                continue

            rid = first_id(
                row,
                "team"
            )

            if rid is None:
                continue

            data.append(
                (
                    rid,
                    row.get("name")
                    or row.get("team_name")
                )
            )

        con.executemany(
            """
            INSERT OR REPLACE INTO teams(
                id,
                name
            )
            VALUES(?,?)
            """,
            data
        )

        imported = len(data)


    con.commit()

    return imported


def already_imported(
    con,
    path
):

    st = os.stat(path)

    row = con.execute(
        """
        SELECT
            size,
            mtime_ns
        FROM import_files
        WHERE path=?
        """,
        (
            os.path.abspath(path),
        )
    ).fetchone()

    if row is None:
        return False

    return (
        int(row[0]) == st.st_size
        and
        int(row[1]) == st.st_mtime_ns
    )


def mark_imported(
    con,
    path,
    count
):

    st = os.stat(path)

    con.execute(
        """
        INSERT OR REPLACE INTO import_files(
            path,
            size,
            mtime_ns,
            imported_at,
            rows_imported
        )
        VALUES(?,?,?,?,?)
        """,
        (
            os.path.abspath(path),
            st.st_size,
            st.st_mtime_ns,
            int(time.time()),
            count
        )
    )

    con.commit()


def safe_int(value):

    if value is None:
        return None

    try:
        return int(value)
    except Exception:
        return None


def import_detection_file(
    con,
    path
):

    if already_imported(
        con,
        path
    ):
        return 0, True

    obj = load_json(path)

    if isinstance(obj, dict):
        events = obj.get(
            "detections",
            []
        )
    elif isinstance(obj, list):
        events = obj
    else:
        events = []

    batch = []

    for event in events:

        if not isinstance(
            event,
            dict
        ):
            continue

        detection_id = event.get(
            "id"
        )

        timestamp = safe_int(
            event.get(
                "timestamp"
            )
        )

        if (
            detection_id is None
            or timestamp is None
        ):
            continue

        visible = event.get(
            "visible"
        )

        if visible is True:
            visible_db = 1

        elif visible is False:
            visible_db = 0

        else:
            visible_db = None

        batch.append(
            (
                str(detection_id),
                timestamp,
                safe_int(
                    event.get(
                        "time_received"
                    )
                ),
                safe_int(
                    event.get(
                        "device_id"
                    )
                ),
                safe_int(
                    event.get(
                        "user_id"
                    )
                ),
                safe_int(
                    event.get(
                        "team_id"
                    )
                ),
                safe_int(
                    event.get("x")
                ),
                safe_int(
                    event.get("y")
                ),
                visible_db,
                (
                    str(
                        event.get(
                            "source"
                        )
                    )
                    if event.get(
                        "source"
                    ) is not None
                    else None
                )
            )
        )

    if batch:

        con.executemany(
            """
            INSERT OR REPLACE INTO network_detections(
                detection_id,
                timestamp_ms,
                time_received_ms,
                device_id,
                user_id,
                team_id,
                x,
                y,
                visible,
                source
            )
            VALUES(?,?,?,?,?,?,?,?,?,?)
            """,
            batch
        )

    mark_imported(
        con,
        path,
        len(batch)
    )

    con.commit()

    return len(batch), False


def main():

    os.makedirs(
        args.dir,
        exist_ok=True
    )

    os.makedirs(
        os.path.join(
            args.dir,
            "detections"
        ),
        exist_ok=True
    )

    if (
        args.rebuild
        and os.path.exists(
            args.db
        )
    ):
        os.remove(
            args.db
        )

    con = connect()

    try:

        schema(con)

        device_count = import_mapping(
            con,
            os.path.join(
                args.dir,
                "device_mapping.json"
            ),
            "device"
        )

        user_count = import_mapping(
            con,
            os.path.join(
                args.dir,
                "user_mapping.json"
            ),
            "user"
        )

        team_count = import_mapping(
            con,
            os.path.join(
                args.dir,
                "team_mapping.json"
            ),
            "team"
        )

        total_new = 0
        skipped = 0
        file_count = 0

        paths = sorted(
            glob.glob(
                os.path.join(
                    args.dir,
                    "detections",
                    "export_*.json"
                )
            )
        )

        for path in paths:

            file_count += 1

            count, was_skipped = (
                import_detection_file(
                    con,
                    path
                )
            )

            if was_skipped:
                skipped += 1
            else:
                total_new += count

                print(
                    "IMPORT",
                    os.path.basename(
                        path
                    ),
                    "=",
                    count
                )

        total = con.execute(
            """
            SELECT COUNT(*)
            FROM network_detections
            """
        ).fetchone()[0]

        devices = con.execute(
            """
            SELECT
                COUNT(
                    DISTINCT device_id
                )
            FROM network_detections
            WHERE device_id IS NOT NULL
            """
        ).fetchone()[0]

        con.execute(
            """
            INSERT OR REPLACE INTO network_meta(
                key,
                value
            )
            VALUES(
                'last_import_unix',
                ?
            )
            """,
            (
                str(
                    int(
                        time.time()
                    )
                ),
            )
        )

        con.commit()

        print()
        print(
            "========================================"
        )
        print(
            " CREDO NETWORK IMPORT V11.4"
        )
        print(
            "========================================"
        )

        print(
            "FILES =",
            file_count
        )

        print(
            "FILES_SKIPPED =",
            skipped
        )

        print(
            "NEW_ROWS =",
            total_new
        )

        print(
            "TOTAL_ROWS =",
            total
        )

        print(
            "NETWORK_DEVICES =",
            devices
        )

        print(
            "DEVICE_MAPPING =",
            device_count
        )

        print(
            "USER_MAPPING =",
            user_count
        )

        print(
            "TEAM_MAPPING =",
            team_count
        )

        print(
            "IMPORT=OK"
        )

    finally:
        con.close()


if __name__ == "__main__":
    main()
