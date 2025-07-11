let currentColor = 'green';
const commandHistory = [];

const terminal = document.getElementById('terminal');
const input = document.getElementById('command-input');
const cursor = document.getElementById('cursor');
const keySound = document.getElementById('key-sound');
const terminalSound = document.getElementById('terminal-loop');
const logoSound = document.getElementById('logo-sound');

window.addEventListener('load', () => {
    terminalSound.currentTime = 0;
    terminalSound.play().catch(() => {
        console.log('Автозапуск звука заблокирован браузером');
    });
});

function setColor(color) {
    currentColor = color;
    const example = document.createElement('div');
    example.className = color;
    document.body.appendChild(example);
    const computedColor = getComputedStyle(example).color;
    input.style.color = computedColor;
    cursor.style.backgroundColor = computedColor;
    document.body.removeChild(example);
}

function appendLine(text) {
    const line = document.createElement('div');
    line.className = currentColor;
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

input.addEventListener('keydown', e => {
    const ignoredKeys = ['Enter', 'Shift', 'Control', 'Alt', 'Meta', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!ignoredKeys.includes(e.key)) {
        keySound.currentTime = 0;
        keySound.play();
    }

    if (e.key === 'Enter') {
        const command = input.value.trim();
        if (command) commandHistory.push(command);
        const lower = command.toLowerCase();
        appendLine('$ ' + command);
        input.value = '';

        if (lower === 'help') {
            appendLine('Доступные команды:\nhelp - список команд\ndate - текущая дата\nclear - очистить экран\nabout - информация о системе\nwhoami - имя пользователя\nuname -a - информация о системе\nls - список файлов\npwd - текущий путь\necho [текст] - вывод текста\ncd [путь] - смена каталога\ncolor [цвет] - сменить цвет\ncalc [выражение] - калькулятор\nhistory - история команд\nexit - выход');
        } else if (lower === 'date') {
            appendLine(new Date().toString());
        } else if (lower === 'clear') {
            terminal.innerHTML = '';
            return;
        } else if (lower === 'about') {
            appendLine('MIAR 99 System v1.00\n© MIAR Systems 1991–1999.');
        } else if (lower === 'whoami') {
            appendLine('miar99_user');
        } else if (lower === 'uname -a') {
            appendLine('Miar99 x86_64 GNU/Miar99 v5.15');
        } else if (lower === 'ls') {
            appendLine('Documents  Downloads  system.log  readme.txt');
        } else if (lower === 'pwd') {
            appendLine('/home/miar_user');
        } else if (lower.startsWith('echo ')) {
            appendLine(command.slice(5));
        } else if (lower.startsWith('cd')) {
            appendLine('Переход в каталог... (заглушка)');
        } else if (lower.startsWith('color ')) {
            const color = lower.split(' ')[1];
            const validColors = ['green', 'red', 'blue'];
            if (validColors.includes(color)) {
                setColor(color);
                appendLine('Цвет текста изменён на ' + color);
            } else {
                appendLine('Недопустимый цвет. Доступные: green, red, blue');
            }
        } else if (lower.startsWith('calc ')) {
            const expression = command.slice(5);
            try {
                const result = eval(expression);
                appendLine('= ' + result);
            } catch (err) {
                appendLine('Ошибка в выражении.');
            }
        } else if (lower === 'history') {
            if (commandHistory.length === 0) {
                appendLine('История пуста.');
            } else {
                commandHistory.forEach((cmd, index) => {
                    appendLine(`${index + 1}: ${cmd}`);
                });
            }
        } else if (lower === 'exit') {
            appendLine('Завершение сеанса...');
            setTimeout(() => location.reload(), 1000);
        } else {
            appendLine('Команда не найдена: ' + command);
        }

        appendLine('+================+');
    }
});

// Intro and Logo code
const introLines = document.querySelectorAll('#intro .line');
introLines.forEach((line, i) => {
    setTimeout(() => line.style.opacity = 1, i * 600);
});

const totalBootTime = introLines.length * 600 + 500;

setTimeout(() => {
    document.getElementById('intro').style.display = 'none';

    const logoLines = document.querySelectorAll('.logo-line');
    const logo = document.getElementById('logo');
    logo.style.display = 'block';


    logoSound.currentTime = 0;
    logoSound.play();

    logoLines.forEach((line, i) => {
        setTimeout(() => line.style.opacity = 1, i * 130);
    });

    setTimeout(() => {
        document.getElementById('press-key').classList.add('visible');
    }, logoLines.length * 130 + 1000);

    function keyHandler(e) {
        if (e.key === 'Enter') {
            logo.style.display = 'none';
            document.getElementById('terminal-container').style.display = 'flex';
            input.focus();
            terminalSound.play();
            document.removeEventListener('keydown', keyHandler);
        } else if (e.key === 'Escape') {
            alert("Загрузка отменена.");
            document.removeEventListener('keydown', keyHandler);
        }
    }

    document.addEventListener('keydown', keyHandler);
}, totalBootTime);

setColor(currentColor);