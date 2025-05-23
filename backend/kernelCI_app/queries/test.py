from typing import Optional

from django.db import connection
from kernelCI_app.helpers.database import dict_fetchall
from kernelCI_app.models import Tests
from kernelCI_app.typeModels.databases import (
    Build__ConfigName,
    Checkout__GitRepositoryBranch,
    Checkout__GitRepositoryUrl,
    Origin,
    Test__Path,
    Test__StartTime,
    Timestamp,
)


def get_test_details_data(*, test_id: str) -> list[dict]:
    params = {"test_id": test_id}

    query = """
    SELECT
        T._TIMESTAMP,
        T.ID,
        T.BUILD_ID,
        T.STATUS,
        T.PATH,
        T.LOG_EXCERPT,
        T.LOG_URL,
        T.MISC,
        T.ENVIRONMENT_MISC,
        T.START_TIME,
        T.ENVIRONMENT_COMPATIBLE,
        T.OUTPUT_FILES,
        T.INPUT_FILES,
        B.COMPILER,
        B.ARCHITECTURE,
        B.CONFIG_NAME,
        C.GIT_COMMIT_HASH,
        C.GIT_REPOSITORY_BRANCH,
        C.GIT_REPOSITORY_URL,
        C.GIT_COMMIT_TAGS,
        C.TREE_NAME,
        C.ORIGIN
    FROM
        TESTS T
        LEFT JOIN BUILDS B ON T.BUILD_ID = B.ID
        LEFT JOIN CHECKOUTS C ON B.CHECKOUT_ID = C.ID
    WHERE
        T.ID = %(test_id)s
    """

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        return dict_fetchall(cursor)


def get_test_status_history(
    *,
    path: Test__Path,
    origin: Origin,
    git_repository_url: Checkout__GitRepositoryUrl,
    git_repository_branch: Checkout__GitRepositoryBranch,
    platform: Optional[str],
    test_start_time: Test__StartTime,
    config_name: Build__ConfigName,
    field_timestamp: Timestamp
):
    query = Tests.objects.filter(
        path=path,
        build__checkout__origin=origin,
        build__checkout__git_repository_url=git_repository_url,
        build__checkout__git_repository_branch=git_repository_branch,
        build__config_name=config_name,
    ).values(
        "start_time",
        "id",
        "status",
        "build__checkout__git_commit_hash",
    )

    if platform is None:
        query = query.filter(environment_misc__platform__isnull=True)
    else:
        query = query.filter(environment_misc__platform=platform)

    if test_start_time is None:
        if field_timestamp is None:
            query = query.filter(
                start_time__isnull=True,
                field_timestamp__isnull=True,
            )
        else:
            query = query.filter(field_timestamp__lte=field_timestamp)
    else:
        query = query.filter(start_time__lte=test_start_time)

    if test_start_time is not None:
        return query.order_by("-start_time")[:10]
    else:
        return query.order_by("-field_timestamp")[:10]
