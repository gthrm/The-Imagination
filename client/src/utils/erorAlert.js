/* eslint-disable no-undef */
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Alert = withReactContent(Swal); // сюда можно присвоить любой обработчик

export default (value) => {
  if (value?.response?.status) {
    switch (true) {
      case value.response.status === 401 && value?.response?.data?.message === 'You have no permissions to perform such request on this endpoint':
        getAlert(
          'Ошибка', 'У вас нет прав для совершения этой операции!'
        );
        break;
      case value.response.status === 401:
        getAlert(
          'Данные не верны!', ''
        );
        break;
      case value.response.status === 500:
        getAlert(
          'Внутренняя ошибка сервера!',
          'Повторите попытку позднее'
        );
        break;
      case value.response.status === 404:
        getAlert('Упс!', 'Что-то пошло не так. Повторите попытку позднее.');
        break;
      case value.response.status === 400:
        getAlert('Bad request', 'Ошибка сервера. Повторите попытку позднее.');
        break;
      case value.response.status === undefined:
        getAlert('Проверьте подключение к сети!', '');
        break;
      default:
        getAlert('Проверьте подключение к сети!', '');
        break;
    }
  }
};

export const getAlert = (title, text, func, showCancelButton = false) => {
  Alert.fire({
    title,
    text,
    showCancelButton,
    icon: 'error'
  })
    .then((result) => {
      if (result && func) {
        func();
      }
    });
};
