export const theme = {
  colors: {
    primaryColor: "#233142",
    primaryFont: "#5c6070",
    primaryFontMuted: "#FFFFFF48",
    primaryFontLess: "#5c6070",
    contrastColor: 'white',
    contrastFont: "white",
    contrastLessFont: "#acb2c1",
    secondaryColor: "#455D7A",
    contentBackgroundColor: "#e1e3e8",
    itemBackgroundColor: "white",
    lineColor: "#455D7A",
    success: "#326342",
    fail: "darkred",
    warn: "tomato"
  },

  dims: {
    topBarHeight: "0px",
    sideBarWidth: "220px"
  },

  ali: (name) => {
    if(name === 'success') return 'success';
    if(name === 'connected') return "success";
    if(name === 'true') return "success";
    if(name === 'fail') return 'fail';
    if(name === 'failure') return 'fail';
    if(name === 'failed') return 'fail';
    if(name === 'idle') return 'primaryFontLess'
  }
};