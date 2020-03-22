export default {
    twoHexRegex: /^[0-9a-fA-F]{2}$/,
    sixHexRegex: /^[0-9a-fA-F]{6}$/,
    integerRegex: /^[0-9]*$/,
    precisionRegex: /^[0-9.]*$/,
    rgbRegex: /^rgb\((\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)\)$/,
    rgbaRegex: /^rgba\((\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\)$/,
};
