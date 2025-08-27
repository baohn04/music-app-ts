import unidecode from "unidecode";

export const convertToSlug = (text: string): string => {
  const unidecodeText = unidecode(text.trim()); // strim(): Bỏ khoảng trắng ở cuối text
  const slug: string = unidecodeText.replace(/\s+/g, "-"); // /\s+/g: Tìm khoảng trắng của text và thay thế thành dấu "-"
  return slug;
}