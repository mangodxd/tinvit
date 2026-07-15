import re
import unicodedata

_VIETNAMESE_MAP = str.maketrans({
    "đ": "d", "Đ": "d",
})


def make_slug(title: str, max_len: int = 200) -> str:
    """Convert a title to a URL-friendly slug.

    Args:
        title: The input title string.
        max_len: Maximum length of the resulting slug.

    Returns:
        A URL-friendly slug string.
    """
    text = title.lower().strip().translate(_VIETNAMESE_MAP)
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text.strip())
    return text[:max_len].strip("-")
