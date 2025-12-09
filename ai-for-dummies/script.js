// Общие функции для всех страниц

// Адаптивное меню
document.addEventListener('DOMContentLoaded', function() {
    // Меню для мобильных устройств
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Создаем мобильное меню, если его еще нет
            if (!document.querySelector('.mobile-menu')) {
                const mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                mobileMenu.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background-color: var(--primary-blue);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                `;
                
                // Копируем навигационное меню
                const menuClone = navMenu.cloneNode(true);
                menuClone.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 30px;
                `;
                
                // Изменяем стили пунктов меню
                const menuItems = menuClone.querySelectorAll('li');
                menuItems.forEach(item => {
                    item.style.margin = '10px 0';
                });
                
                // Копируем кнопки действий
                const actionsClone = navActions.cloneNode(true);
                actionsClone.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    width: 200px;
                `;
                
                // Добавляем кнопку закрытия
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    color: var(--text-white);
                    font-size: 1.5rem;
                    cursor: pointer;
                `;
                
                mobileMenu.appendChild(closeBtn);
                mobileMenu.appendChild(menuClone);
                mobileMenu.appendChild(actionsClone);
                document.body.appendChild(mobileMenu);
                
                // Обработчик закрытия меню
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(mobileMenu);
                });
                
                // Закрытие меню при клике на ссылку
                const mobileLinks = mobileMenu.querySelectorAll('a');
                mobileLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        document.body.removeChild(mobileMenu);
                    });
                });
            }
        });
    }
    
    // Функциональность для страницы курса
    if (document.querySelector('.course-header')) {
        initCoursePage();
    }
    
    // Функциональность для страницы тренажера
    if (document.querySelector('.trainer-container')) {
        initTrainerPage();
    }
});

// Функции для страницы курса
function initCoursePage() {
    const lessonChecks = document.querySelectorAll('.lesson-check');
    const moduleChecks = document.querySelectorAll('.module-check');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const completeCourseBtn = document.getElementById('completeCourse');
    
    // Восстанавливаем состояние из localStorage
    function loadProgress() {
        const savedProgress = localStorage.getItem('aiCourseProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            
            // Восстанавливаем состояние уроков
            lessonChecks.forEach((checkbox, index) => {
                if (progress.lessons && progress.lessons[index]) {
                    checkbox.checked = true;
                    // Обновляем визуальное состояние чекбокса
                    const label = checkbox.nextElementSibling;
                    if (label && checkbox.checked) {
                        label.style.backgroundColor = 'var(--accent-blue)';
                        label.style.borderColor = 'var(--accent-blue)';
                    }
                }
            });
            
            // Восстанавливаем состояние модулей
            moduleChecks.forEach((checkbox, index) => {
                if (progress.modules && progress.modules[index]) {
                    checkbox.checked = true;
                    // Обновляем визуальное состояние чекбокса
                    const label = checkbox.nextElementSibling;
                    if (label && checkbox.checked) {
                        label.style.backgroundColor = 'var(--accent-blue)';
                        label.style.borderColor = 'var(--accent-blue)';
                    }
                }
            });
            
            updateProgress();
        }
    }
    
    // Сохраняем прогресс в localStorage
    function saveProgress() {
        const lessons = Array.from(lessonChecks).map(checkbox => checkbox.checked);
        const modules = Array.from(moduleChecks).map(checkbox => checkbox.checked);
        
        const progress = {
            lessons: lessons,
            modules: modules
        };
        
        localStorage.setItem('aiCourseProgress', JSON.stringify(progress));
    }
    
    // Обновляем прогресс-бар
    function updateProgress() {
        const totalLessons = lessonChecks.length;
        const completedLessons = Array.from(lessonChecks).filter(cb => cb.checked).length;
        
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}% завершено`;
        }
        
        // Проверяем, все ли уроки завершены
        if (completeCourseBtn) {
            if (completedLessons === totalLessons) {
                completeCourseBtn.disabled = false;
                completeCourseBtn.textContent = "Получить сертификат";
            } else {
                completeCourseBtn.disabled = true;
                completeCourseBtn.textContent = "Завершить курс";
            }
        }
    }
    
    // Обработчики для чекбоксов уроков
    lessonChecks.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Обновляем визуальное состояние чекбокса
            const label = this.nextElementSibling;
            if (label) {
                if (this.checked) {
                    label.style.backgroundColor = 'var(--accent-blue)';
                    label.style.borderColor = 'var(--accent-blue)';
                } else {
                    label.style.backgroundColor = '';
                    label.style.borderColor = 'var(--accent-light)';
                }
            }
            
            // Проверяем, все ли уроки в модуле завершены
            const moduleItem = this.closest('.module-item');
            if (moduleItem) {
                const moduleCard = moduleItem.closest('.module-card');
                if (moduleCard) {
                    const moduleId = moduleCard.dataset.module;
                    const moduleLessons = moduleCard.querySelectorAll('.lesson-check');
                    const allChecked = Array.from(moduleLessons).every(cb => cb.checked);
                    
                    // Находим чекбокс модуля
                    const moduleCheck = moduleCard.querySelector('.module-check');
                    if (moduleCheck) {
                        moduleCheck.checked = allChecked;
                        
                        // Обновляем визуальное состояние чекбокса модуля
                        const moduleLabel = moduleCheck.nextElementSibling;
                        if (moduleLabel) {
                            if (allChecked) {
                                moduleLabel.style.backgroundColor = 'var(--accent-blue)';
                                moduleLabel.style.borderColor = 'var(--accent-blue)';
                            } else {
                                moduleLabel.style.backgroundColor = '';
                                moduleLabel.style.borderColor = 'var(--accent-light)';
                            }
                        }
                    }
                }
            }
            
            saveProgress();
            updateProgress();
        });
    });
    
    // Обработчики для чекбоксов модулей
    moduleChecks.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Обновляем визуальное состояние чекбокса
            const label = this.nextElementSibling;
            if (label) {
                if (this.checked) {
                    label.style.backgroundColor = 'var(--accent-blue)';
                    label.style.borderColor = 'var(--accent-blue)';
                } else {
                    label.style.backgroundColor = '';
                    label.style.borderColor = 'var(--accent-light)';
                }
            }
            
            // Устанавливаем состояние всех уроков в модуле
            const moduleCard = this.closest('.module-card');
            if (moduleCard) {
                const lessonChecksInModule = moduleCard.querySelectorAll('.lesson-check');
                lessonChecksInModule.forEach(lessonCheck => {
                    lessonCheck.checked = this.checked;
                    
                    // Обновляем визуальное состояние чекбоксов уроков
                    const lessonLabel = lessonCheck.nextElementSibling;
                    if (lessonLabel) {
                        if (this.checked) {
                            lessonLabel.style.backgroundColor = 'var(--accent-blue)';
                            lessonLabel.style.borderColor = 'var(--accent-blue)';
                        } else {
                            lessonLabel.style.backgroundColor = '';
                            lessonLabel.style.borderColor = 'var(--accent-light)';
                        }
                    }
                });
            }
            
            saveProgress();
            updateProgress();
        });
    });
    
    // Обработчик для кнопки завершения курса
    if (completeCourseBtn) {
        completeCourseBtn.addEventListener('click', function() {
            if (!this.disabled) {
                alert('Поздравляем! Вы завершили курс по основам ИИ. Сертификат отправлен на вашу электронную почту.');
                
                // Здесь обычно была бы логика отправки сертификата
                // Например, вызов API или перенаправление на страницу сертификата
            }
        });
    }
    
    // Загружаем прогресс при загрузке страницы
    loadProgress();
}

// Функции для страницы тренажера
function initTrainerPage() {
    const stepItems = document.querySelectorAll('.step-item');
    const stepPanels = document.querySelectorAll('.step-panel');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const currentStepEl = document.getElementById('currentStep');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const sentimentResult = document.getElementById('sentimentResult');
    const downloadCertBtn = document.getElementById('downloadCert');
    
    let currentStep = 1;
    const totalSteps = 6;
    
    // Загружаем сохраненный прогресс
    function loadTrainerProgress() {
        const savedStep = localStorage.getItem('aiTrainerStep');
        if (savedStep) {
            currentStep = parseInt(savedStep);
            updateStepDisplay();
        }
        
        // Загружаем состояние чекбоксов
        for (let i = 1; i <= totalSteps; i++) {
            const checkbox = document.getElementById(`step${i}-check`);
            if (checkbox) {
                const isChecked = localStorage.getItem(`aiTrainerStep${i}`);
                if (isChecked === 'true') {
                    checkbox.checked = true;
                }
            }
        }
    }
    
    // Сохраняем прогресс
    function saveTrainerProgress() {
        localStorage.setItem('aiTrainerStep', currentStep.toString());
        
        // Сохраняем состояние чекбоксов
        for (let i = 1; i <= totalSteps; i++) {
            const checkbox = document.getElementById(`step${i}-check`);
            if (checkbox) {
                localStorage.setItem(`aiTrainerStep${i}`, checkbox.checked.toString());
            }
        }
    }
    
    // Обновляем отображение шага
    function updateStepDisplay() {
        // Обновляем активный шаг в боковой панели
        stepItems.forEach(item => {
            const step = parseInt(item.dataset.step);
            if (step === currentStep) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Обновляем активную панель
        stepPanels.forEach(panel => {
            if (panel.id === `step${currentStep}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        // Обновляем кнопки навигации
        if (prevBtn) {
            prevBtn.disabled = currentStep === 1;
        }
        
        if (nextBtn) {
            if (currentStep === totalSteps) {
                nextBtn.textContent = "Завершить";
            } else {
                nextBtn.textContent = "Далее";
            }
        }
        
        // Обновляем индикатор шага
        if (currentStepEl) {
            currentStepEl.textContent = currentStep;
        }
        
        // Сохраняем прогресс
        saveTrainerProgress();
    }
    
    // Переход к следующему шагу
    function goToNextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        } else {
            // Последний шаг - завершение
            alert('Поздравляем! Вы успешно прошли тренажер по созданию нейросети!');
        }
    }
    
    // Переход к предыдущему шагу
    function goToPrevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    }
    
    // Копирование кода
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeId = this.dataset.code;
            const codeElement = document.getElementById(codeId);
            
            if (codeElement) {
                const codeText = codeElement.textContent;
                
                // Используем современный API для копирования
                navigator.clipboard.writeText(codeText).then(() => {
                    // Временно меняем текст кнопки
                    const originalText = this.textContent;
                    this.textContent = 'Скопировано!';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Ошибка при копировании: ', err);
                });
            }
        });
    });
    
    // Демонстрация анализа настроения (шаг 5)
    if (sendBtn && userInput && sentimentResult) {
        sendBtn.addEventListener('click', analyzeSentiment);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                analyzeSentiment();
            }
        });
    }
    
    function analyzeSentiment() {
        const text = userInput.value.trim();
        
        if (!text) {
            alert('Пожалуйста, введите текст для анализа');
            return;
        }
        
        // Простая логика определения настроения (для демонстрации)
        let sentiment = 'neutral';
        const positiveWords = ['рад', 'хорошо', 'отлично', 'здорово', 'нравится', 'люблю', 'обожаю', 'прекрасно', 'замечательно'];
        const negativeWords = ['плохо', 'ужасно', 'ненавижу', 'раздражает', 'грустно', 'печально', 'злюсь', 'злой'];
        
        const lowerText = text.toLowerCase();
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
            if (lowerText.includes(word)) positiveCount++;
        });
        
        negativeWords.forEach(word => {
            if (lowerText.includes(word)) negativeCount++;
        });
        
        if (positiveCount > negativeCount) {
            sentiment = 'positive';
        } else if (negativeCount > positiveCount) {
            sentiment = 'negative';
        }
        
        // Отображаем результат
        let sentimentText = '';
        let sentimentColor = '';
        
        switch(sentiment) {
            case 'positive':
                sentimentText = 'Позитивное настроение 😊';
                sentimentColor = '#64ffda';
                break;
            case 'negative':
                sentimentText = 'Негативное настроение 😔';
                sentimentColor = '#f94144';
                break;
            default:
                sentimentText = 'Нейтральное настроение 😐';
                sentimentColor = '#8892b0';
        }
        
        sentimentResult.innerHTML = `
            <p>Текст: "${text}"</p>
            <p style="color: ${sentimentColor}; font-size: 1.2rem;">${sentimentText}</p>
        `;
        
        // Очищаем поле ввода
        userInput.value = '';
    }
    
    // Кнопка скачивания сертификата
    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', function() {
            alert('Сертификат успешно скачан! Поздравляем с завершением тренажера!');
            // В реальном приложении здесь был бы запрос на сервер для генерации PDF
        });
    }
    
    // Обработчики для шагов
    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            const step = parseInt(this.dataset.step);
            currentStep = step;
            updateStepDisplay();
        });
    });
    
    // Обработчики для кнопок навигации
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevStep);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextStep);
    }
    
    // Обработчики для чекбоксов заданий
    for (let i = 1; i <= totalSteps; i++) {
        const checkbox = document.getElementById(`step${i}-check`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                saveTrainerProgress();
            });
        }
    }
    
    // Загружаем прогресс при загрузке страницы
    loadTrainerProgress();
}