"""Text artifacts use the encoding advertised to HTTP clients on every host."""

from designagent.artifacts.store import ArtifactStore


def test_unicode_summary_and_notebook_survive_reload(tmp_path):
    store = ArtifactStore(tmp_path)
    text = "Sequence ΔG — catalytic β strand 🧬\n"
    ref = store.add("markdown", "ΔG summary", content=text, session_id="s1")

    reloaded = ArtifactStore(tmp_path)
    assert reloaded.read_bytes(ref["id"]).decode("utf-8") == text
    assert reloaded.list_for_session("s1")[0]["title"] == "ΔG summary"
    reloaded.add("markdown", "ΔG summary", content=text * 2, artifact_id=ref["id"])
    assert reloaded.read_bytes(ref["id"]).decode("utf-8") == text * 2


def test_a_corrupt_index_does_not_block_the_next_artifact(tmp_path):
    ArtifactStore(tmp_path)
    (tmp_path / "index.json").write_bytes(b"\xff\xfe not json")
    recovered = ArtifactStore(tmp_path)
    ref = recovered.add("markdown", "recovered", content="ok\n", session_id="s")
    assert ArtifactStore(tmp_path).read_bytes(ref["id"]).decode("utf-8") == "ok\n"
