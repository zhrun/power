/**
 * https://github.com/creeperyang/pinyin
 */
import Pinyin from "pinyin4js";

/**
 *
 * @param {String} str  待转换的汉字
 * @param {String} separator  分隔符
 * @param {Stirng} tone 风格 WITH_TONE_NUMBER--数字代表声调，WITHOUT_TONE--不带声调，WITH_TONE_MARK--带声调,pinyin4js.FIRST_LETTER--输出首字母
 */
export const convert = function(
  str = "",
  separator = "",
  tone = Pinyin.WITHOUT_TONE
) {
  return Pinyin.convertToPinyinString(str, separator, tone);
};

// 全拼 ex: 中国 -> "zhongguo"
export const spelling = function(str) {
  return convert(str);
};
// 全拼首字母大写 ex: 中国 -> "ZhongGuo"
export const spellingU = function(str) {
  const res = convert(str, ",").split(","); // 中国 -> ['zhong', 'guo']
  return res.reduce((p, c) => {
    return p + c.replace(c[0], c[0].toUpperCase());
  }, "");
};
// 简拼 ex: 中国  [['z'], ['g']] -> "zg"
export const logogram = function(str) {
  return convert(str, "", Pinyin.FIRST_LETTER);
};
// 简拼大写 ex: 中国 "ZG"
export const logogramU = function(str) {
  return convert(str, "", Pinyin.FIRST_LETTER).toUpperCase();
};
