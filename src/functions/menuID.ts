export default function menuID(length: number) {
    for (
      var s = "";
      s.length < length;
      s +=
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
          (Math.random() * 62) | 0
        )
    );
    return s;
  }