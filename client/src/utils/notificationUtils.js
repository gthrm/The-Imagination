import { store } from 'react-notifications-component';

const showMessage = ({
  message = '',
  type = 'success',
  insert = 'top',
  container = 'top-right',
}) => store.addNotification({
  message,
  type,
  insert,
  container,
  animationIn: ['animated', 'fadeIn'],
  animationOut: ['animated', 'fadeOut'],
  dismiss: {
    duration: 5000,
    onScreen: true
  },
  touchSlidingExit: {
    swipe: {
      duration: 400,
      timingFunction: 'ease-out',
      delay: 0,
    },
    fade: {
      duration: 400,
      timingFunction: 'ease-out',
      delay: 0
    }
  }
});

export default showMessage;
