
export default {
  updateUnverifyNum(state, {unverifyNum}) {
    state.unverifyNum = unverifyNum
  },
  exitLogin() {
    // 退出登录
    try {
      localStorage.removeItem("dic");
      localStorage.removeItem("vis_userId");
    } catch(err) {
      console.log(err);
    }
  },
  updateProgramNum(state, {programNum}) {
    state.programNum = programNum
  },
  updateImmediateMessage(state, {immediateMessage}) {
    state.immediateMessage = immediateMessage
  }
}
