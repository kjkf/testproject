;(function () {
    const template = `<ul class="ca-menu">
            <li data-path="login.html">
                <a data-href="#">
                    <span class="ca-icon"><i class="fa fa-home" aria-hidden="true"></i></span>
                    <div class="ca-content">
                        <h2 class="ca-main">Главная</h2>
                    </div>
                </a>
            </li>
            <li  data-path="">
                <a href="#">
                    <span class="ca-icon"><i class="fa fa-newspaper" aria-hidden="true"></i></span>
                    <div class="ca-content">
                        <h2 class="ca-main">Новости</h2>
                    </div>
                </a>
            </li>
            <li data-path="">
                <a href="#">
                    <span class="ca-icon"><i class="fa fa-search" aria-hidden="true"></i></span>
                    <div class="ca-content">
                        <h2 class="ca-main">Поиск</h2>
                    </div>
                </a>
            </li>
            <li data-path="index.html">
                <a href="#"">
                    <span class="ca-icon"><i class="fa fa-stop-circle" aria-hidden="true"></i></span>
                    <div class="ca-content">
                        <h2 class="ca-main">Ошибка</h2>
                    </div>
                </a>
            </li>
        </ul>`;

    function createMenu() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = template;

        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        const lis = overlay.querySelectorAll('.ca-menu li');

        lis.forEach(li => {
            let path = li.dataset.path;
            li.addEventListener('click', e => goTo(path));
        });

        return overlay;
    }

    const menuBtn = document.querySelector('.gum-menu-wrapper');
    menuBtn.addEventListener('click', e => {
        const menu = createMenu();
        document.body.appendChild(menu);
    });

    function goTo(path) {
        if (path) {
           if (window.location.href.indexOf(path) > -1) return false;
           window.location.href = path;
       }
    }

    const homeMenu = document.querySelector('.home-menu');
    homeMenu.addEventListener('click', e => {
        goTo('login.html');
    });

    if (window.location.href.indexOf('signup') > -1) {
        let signupBtn = document.getElementById('signup');
        signupBtn.addEventListener('click', e => {
            let pass1 = document.getElementById('newpassword').value;
            let pass2 = document.getElementById('newpassword2').value;
            let requirements = document.querySelector('.requirements.repeat-password');

            if (pass1 !== pass2) {
                requirements.innerHTML = 'Пароли не совпадают';
                requirements.classList.add('show');
            }

            setTimeout(() => {
                requirements.classList.remove('show');
                requirements.innerHTML = 'Пароль должен содержать хотя бы одну цифру, хотя бы одну латинскую букву в верхнем и нижнем регистре. Длина пароля не меньше 6 символов.';
            }, 2000);

            return false;
        })
    }


})();