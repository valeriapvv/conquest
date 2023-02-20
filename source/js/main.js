const navigation = document.querySelector('.main-navigation');
const navigationToggle = navigation.querySelector('.main-navigation__button');

const navigationVisibleClass = 'main-navigation--mobile-opened';

const activateNavigationMenu = () => {
  navigation.classList.remove(navigationVisibleClass);

  navigationToggle.addEventListener('click', () => {
    navigation.classList.toggle(navigationVisibleClass);
  });
};

activateNavigationMenu();
