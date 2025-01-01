function getInitials(name) {
  if (!name) return "";
  const nameArr = name.split(" ");
  let finalStr = "";

  for (let token of nameArr) {
    finalStr += token.charAt(0).toUpperCase();
  }

  return finalStr;
}

const userUtils = { getInitials };

export default userUtils;
