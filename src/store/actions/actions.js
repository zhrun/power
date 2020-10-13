
export default {
  updateUnverifyNumAsync(store, unverifyNum) {
    store.commit('updateUnverifyNum', {
      unverifyNum: unverifyNum,
    });
  },
  updateProgramNumAsync(store, programNum) {
    store.commit('updateProgramNum', {
      programNum: programNum,
    });
  },
  updateImmediateMessageAsync(store, immediateMessage) {
    store.commit('updateImmediateMessage', {
      immediateMessage: immediateMessage,
    });
  },
}

