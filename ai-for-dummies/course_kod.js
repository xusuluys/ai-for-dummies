// JavaScript для страницы курса
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const moduleItems = document.querySelectorAll('.module-item');
    const lessonItems = document.querySelectorAll('.lesson-item');
    const topics = document.querySelectorAll('.topic');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const currentTopicEl = document.getElementById('currentTopic');
    const prevBtn = document.getElementById('prevTopic');
    const nextBtn = document.getElementById('nextTopic');
    const completionCheckboxes = document.querySelectorAll('.completion-checkbox');
    const moduleCheckboxes = document.querySelectorAll('.module-checkbox');
    const lessonCheckboxes = document.querySelectorAll('.lesson-checkbox');
    
    let currentTopicId = 'topic1-1';
    const totalLessons = lessonCheckboxes.length;
    
    // Загрузка прогресса из localStorage
    function loadProgress() {
        const savedProgress = localStorage.getItem('aiCourseProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            
            // Восстановление состояния уроков
            lessonCheckboxes.forEach((checkbox, index) => {
                if (progress.lessons && progress.lessons[index]) {
                    checkbox.checked = true;
                }
            });
            
            // Восстановление состояния модулей
            moduleCheckboxes.forEach((checkbox, index) => {
                if (progress.modules && progress.modules[index]) {
                    checkbox.checked = true;
                }
            });
            
            // Восстановление состояния завершения тем
            completionCheckboxes.forEach((checkbox, index) => {
                if (progress.topics && progress.topics[index]) {
                    checkbox.checked = true;
                }
            });
            
            // Восстановление текущей темы
            if (progress.currentTopic) {
                currentTopicId = progress.currentTopic;
                showTopic(currentTopicId);
            }
            
            updateProgress();
        }
    }
    
    // Сохранение прогресса в localStorage
    function saveProgress() {
        const lessons = Array.from(lessonCheckboxes).map(cb => cb.checked);
        const modules = Array.from(moduleCheckboxes).map(cb => cb.checked);
        const topicsCompleted = Array.from(completionCheckboxes).map(cb => cb.checked);
        
        const progress = {
            lessons: lessons,
            modules: modules,
            topics: topicsCompleted,
            currentTopic: currentTopicId
        };
        
        localStorage.setItem('aiCourseProgress', JSON.stringify(progress));
    }
    
    // Обновление прогресс-бара
    function updateProgress() {
        const completedLessons = Array.from(lessonCheckboxes).filter(cb => cb.checked).length;
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}% завершено`;
        }
    }
    
    // Показать определенную тему
    function showTopic(topicId) {
        // Скрыть все темы
        topics.forEach(topic => {
            topic.classList.remove('active');
        });
        
        // Показать выбранную тему
        const targetTopic = document.getElementById(topicId);
        if (targetTopic) {
            targetTopic.classList.add('active');
            
            // Обновить активный урок в сайдбаре
            lessonItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${topicId}`) {
                    item.classList.add('active');
                    
                    // Развернуть родительский модуль
                    const moduleItem = item.closest('.module-item');
                    if (moduleItem) {
                        moduleItem.classList.add('active');
                    }
                }
            });
            
            // Обновить заголовок
            if (currentTopicEl) {
                const topicTitle = targetTopic.querySelector('h1').textContent;
                currentTopicEl.textContent = topicTitle;
            }
            
            // Сохранить текущую тему
            currentTopicId = topicId;
            saveProgress();
            
            // Прокрутить к началу темы
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Получить следующую тему
    function getNextTopic() {
        const currentLesson = document.querySelector(`.lesson-item[href="#${currentTopicId}"]`);
        if (currentLesson) {
            const nextLesson = currentLesson.nextElementSibling;
            if (nextLesson && nextLesson.classList.contains('lesson-item')) {
                return nextLesson.getAttribute('href').substring(1);
            } else {
                // Перейти к следующему модулю
                const currentModule = currentLesson.closest('.module-item');
                if (currentModule) {
                    const nextModule = currentModule.nextElementSibling;
                    if (nextModule && nextModule.classList.contains('module-item')) {
                        const firstLesson = nextModule.querySelector('.lesson-item');
                        if (firstLesson) {
                            return firstLesson.getAttribute('href').substring(1);
                        }
                    }
                }
            }
        }
        return null;
    }
    
    // Получить предыдущую тему
    function getPrevTopic() {
        const currentLesson = document.querySelector(`.lesson-item[href="#${currentTopicId}"]`);
        if (currentLesson) {
            const prevLesson = currentLesson.previousElementSibling;
            if (prevLesson && prevLesson.classList.contains('lesson-item')) {
                return prevLesson.getAttribute('href').substring(1);
            } else {
                // Перейти к предыдущему модулю
                const currentModule = currentLesson.closest('.module-item');
                if (currentModule) {
                    const prevModule = currentModule.previousElementSibling;
                    if (prevModule && prevModule.classList.contains('module-item')) {
                        const lessons = prevModule.querySelectorAll('.lesson-item');
                        if (lessons.length > 0) {
                            return lessons[lessons.length - 1].getAttribute('href').substring(1);
                        }
                    }
                }
            }
        }
        return null;
    }
    
    // Обработчики для кликов по урокам
    lessonItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const topicId = this.getAttribute('href').substring(1);
            showTopic(topicId);
        });
    });
    
    // Обработчики для чекбоксов завершения тем
    completionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Найти соответствующий чекбокс урока
            const topicId = this.closest('.topic').id;
            const lessonItem = document.querySelector(`.lesson-item[href="#${topicId}"]`);
            if (lessonItem) {
                const lessonCheckbox = lessonItem.querySelector('.lesson-checkbox');
                if (lessonCheckbox) {
                    lessonCheckbox.checked = this.checked;
                    
                    // Обновить чекбокс модуля, если нужно
                    const moduleItem = lessonItem.closest('.module-item');
                    if (moduleItem) {
                        const moduleCheckbox = moduleItem.querySelector('.module-checkbox');
                        if (moduleCheckbox) {
                            const allLessonsChecked = Array.from(
                                moduleItem.querySelectorAll('.lesson-checkbox')
                            ).every(cb => cb.checked);
                            moduleCheckbox.checked = allLessonsChecked;
                        }
                    }
                }
            }
            
            saveProgress();
            updateProgress();
        });
    });
    
    // Обработчики для чекбоксов уроков (в сайдбаре)
    lessonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Найти соответствующий чекбокс завершения темы
            const lessonItem = this.closest('.lesson-item');
            if (lessonItem) {
                const topicId = lessonItem.getAttribute('href').substring(1);
                const topic = document.getElementById(topicId);
                if (topic) {
                    const completionCheckbox = topic.querySelector('.completion-checkbox');
                    if (completionCheckbox) {
                        completionCheckbox.checked = this.checked;
                    }
                }
                
                // Обновить чекбокс модуля
                const moduleItem = lessonItem.closest('.module-item');
                if (moduleItem) {
                    const moduleCheckbox = moduleItem.querySelector('.module-checkbox');
                    if (moduleCheckbox) {
                        const allLessonsChecked = Array.from(
                            moduleItem.querySelectorAll('.lesson-checkbox')
                        ).every(cb => cb.checked);
                        moduleCheckbox.checked = allLessonsChecked;
                    }
                }
            }
            
            saveProgress();
            updateProgress();
        });
    });
    
    // Обработчики для чекбоксов модулей
    moduleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const moduleItem = this.closest('.module-item');
            if (moduleItem) {
                const lessonCheckboxesInModule = moduleItem.querySelectorAll('.lesson-checkbox');
                lessonCheckboxesInModule.forEach(lessonCheckbox => {
                    lessonCheckbox.checked = this.checked;
                    
                    // Обновить чекбоксы завершения тем
                    const lessonItem = lessonCheckbox.closest('.lesson-item');
                    if (lessonItem) {
                        const topicId = lessonItem.getAttribute('href').substring(1);
                        const topic = document.getElementById(topicId);
                        if (topic) {
                            const completionCheckbox = topic.querySelector('.completion-checkbox');
                            if (completionCheckbox) {
                                completionCheckbox.checked = this.checked;
                            }
                        }
                    }
                });
            }
            
            saveProgress();
            updateProgress();
        });
    });
    
    // Кнопки навигации
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const prevTopic = getPrevTopic();
            if (prevTopic) {
                showTopic(prevTopic);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const nextTopic = getNextTopic();
            if (nextTopic) {
                showTopic(nextTopic);
            } else {
                alert('Поздравляем! Вы завершили курс!');
            }
        });
    }
    
    // Кнопки навигации внутри тем
    document.querySelectorAll('[data-next], [data-prev]').forEach(button => {
        button.addEventListener('click', function() {
            const targetTopic = this.getAttribute('data-next') || this.getAttribute('data-prev');
            if (targetTopic) {
                showTopic(targetTopic.substring(1));
            }
        });
    });
    
    // Аккордеон
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            item.classList.toggle('active');
        });
    });
    
    // Проверка ответов в квизе
    const checkAnswerButtons = document.querySelectorAll('.check-answer');
    checkAnswerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.closest('.quiz-question');
            const selectedOption = question.querySelector('input[type="radio"]:checked');
            const feedback = question.querySelector('.quiz-feedback');
            
            if (!selectedOption) {
                feedback.textContent = 'Пожалуйста, выберите ответ';
                feedback.className = 'quiz-feedback incorrect';
                return;
            }
            
            if (selectedOption.hasAttribute('data-correct')) {
                feedback.textContent = 'Правильно! Молодец!';
                feedback.className = 'quiz-feedback correct';
            } else {
                feedback.textContent = 'Попробуйте еще раз!';
                feedback.className = 'quiz-feedback incorrect';
            }
        });
    });
    
    // Развертывание/свертывание модулей
    moduleItems.forEach(module => {
        const header = module.querySelector('.module-header');
        header.addEventListener('click', function() {
            module.classList.toggle('active');
        });
    });
    
    // Загрузка прогресса при старте
    loadProgress();
    
    // Инициализация аккордеона
    document.querySelectorAll('.accordion-item').forEach((item, index) => {
        if (index === 0) {
            item.classList.add('active');
            const content = item.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    });
});