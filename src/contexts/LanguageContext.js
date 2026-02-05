import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  uz: {
    // Header
    home: 'Bosh sahifa',
    fields: 'Polyalar',
    myBookings: 'Mening bronlarim',
    profile: 'Profil',
    login: 'Kirish',
    logout: 'Chiqish',
    
    // Auth
    phoneNumber: 'Telefon raqam',
    enterPhone: 'Telefon raqamingizni kiriting',
    sendCode: 'Kod yuborish',
    verifyCode: 'Kodni tasdiqlash',
    enterSmsCode: 'SMS kodni kiriting',
    verify: 'Tasdiqlash',
    register: 'Ro\'yxatdan o\'tish',
    firstName: 'Ism',
    lastName: 'Familiya',
    age: 'Yosh',
    email: 'Email',
    selectUserType: 'Foydalanuvchi turini tanlang',
    regularUser: 'Oddiy foydalanuvchi',
    fieldOwner: 'Polya egasi',
    
    // Home
    topFields: 'Eng yaxshi polyalar',
    featuredFields: 'Reklamali polyalar',
    searchFields: 'Polya qidirish...',
    filters: 'Filterlar',
    location: 'Joylashuv',
    priceRange: 'Narx oralig\'i',
    rating: 'Reyting',
    filter: 'Filtrlash',
    sortBy: 'Qaysi bo\'ylab',
    found: 'Topildi',
    reset: 'Qayta o\'rnatish',
    cheap: 'Arzon',
    medium: 'O\'rtacha',
    expensive: 'Qimmat',
    highestRated: 'Eng yuqori reyting',
    mostReviewed: 'Ko\'p sharhlar',
    lowestPrice: 'Eng arzon narx',
    highestPrice: 'Eng qimmat narx',
    allPrices: 'Barcha narxlar',
    
    // Field Details
    bookNow: 'Bron qilish',
    hourly: 'soatiga',
    address: 'Manzil',
    availability: 'Bo\'sh vaqtlar',
    reviews: 'Sharhlar',
    
    // Booking
    selectDate: 'Sanani tanlang',
    selectTime: 'Vaqtni tanlang',
    duration: 'Davomiyligi',
    hours: 'soat',
    totalPrice: 'Jami narx',
    paymentMethod: 'To\'lov usuli',
    confirmBooking: 'Bronni tasdiqlash',
    
    // Payment
    cardNumber: 'Karta raqami',
    expiryDate: 'Amal qilish muddati',
    cvv: 'CVV',
    payNow: 'To\'lash',
    other: 'Boshqa',
    
    // Booking Confirmation
    bookingConfirmed: 'Bron tasdiqlandi!',
    verificationCode: 'Tasdiqlash kodi',
    saveThisCode: 'Bu kodni saqlang va polya egaliga ko\'rsating',
    
    // Owner Dashboard
    dashboard: 'Boshqaruv paneli',
    myFields: 'Mening polyalarim',
    addField: 'Polya qo\'shish',
    statistics: 'Statistika',
    totalEarnings: 'Jami daromad',
    activeBookings: 'Faol bronlar',
    verifyBooking: 'Bronni tasdiqlash',
    enterVerificationCode: 'Tasdiqlash kodini kiriting',
    checkCode: 'Kodni tekshirish',
    codeCorrect: 'Kod to\'g\'ri!',
    codeIncorrect: 'Kod noto\'g\'ri!',
    attemptsLeft: 'Qolgan urinishlar',
    
    // Add Field
    fieldName: 'Polya nomi',
    fieldDescription: 'Tavsif',
    pricePerHour: 'Soatlik narx',
    uploadPhotos: 'Rasmlar yuklash',
    addFieldFee: 'Polya qo\'shish to\'lovi: 50,000 so\'m',
    submit: 'Yuborish',
    
    // Advertisement
    promoteField: 'Polyani reklama qilish',
    selectPackage: 'Paketni tanlang',
    oneDay: '1 kunlik',
    threeDays: '3 kunlik',
    oneWeek: '1 haftalik',
    twoWeeks: '2 haftalik',
    oneMonth: '1 oylik',
    threeDaysPro: '3 kunlik Pro',
    som: 'so\'m',
    purchase: 'Sotib olish',
    
    // Common
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    back: 'Orqaga',
    next: 'Keyingi',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    success: 'Muvaffaqiyatli!',
  },
  ru: {
    // Header
    home: 'Главная',
    fields: 'Поля',
    myBookings: 'Мои брони',
    profile: 'Профиль',
    login: 'Войти',
    logout: 'Выйти',
    
    // Auth
    phoneNumber: 'Номер телефона',
    enterPhone: 'Введите номер телефона',
    sendCode: 'Отправить код',
    verifyCode: 'Подтвердить код',
    enterSmsCode: 'Введите SMS код',
    verify: 'Подтвердить',
    register: 'Регистрация',
    firstName: 'Имя',
    lastName: 'Фамилия',
    age: 'Возраст',
    email: 'Email',
    selectUserType: 'Выберите тип пользователя',
    regularUser: 'Обычный пользователь',
    fieldOwner: 'Владелец поля',
    
    // Home
    topFields: 'Лучшие поля',
    featuredFields: 'Рекламные поля',
    searchFields: 'Поиск полей...',
    filters: 'Фильтры',
    location: 'Местоположение',
    priceRange: 'Диапазон цен',
    rating: 'Рейтинг',
    filter: 'Фильтр',
    sortBy: 'Сортировать по',
    found: 'Найдено',
    reset: 'Сбросить',
    cheap: 'Дешево',
    medium: 'Среднее',
    expensive: 'Дорого',
    highestRated: 'Наивысший рейтинг',
    mostReviewed: 'Больше всего отзывов',
    lowestPrice: 'Самая низкая цена',
    highestPrice: 'Самая высокая цена',
    allPrices: 'Все цены',
    
    // Field Details
    bookNow: 'Забронировать',
    hourly: 'в час',
    address: 'Адрес',
    availability: 'Доступность',
    reviews: 'Отзывы',
    
    // Booking
    selectDate: 'Выберите дату',
    selectTime: 'Выберите время',
    duration: 'Продолжительность',
    hours: 'часов',
    totalPrice: 'Итого',
    paymentMethod: 'Способ оплаты',
    confirmBooking: 'Подтвердить бронь',
    
    // Payment
    cardNumber: 'Номер карты',
    expiryDate: 'Срок действия',
    cvv: 'CVV',
    payNow: 'Оплатить',
    other: 'Другое',
    
    // Booking Confirmation
    bookingConfirmed: 'Бронь подтверждена!',
    verificationCode: 'Код подтверждения',
    saveThisCode: 'Сохраните этот код и покажите владельцу поля',
    
    // Owner Dashboard
    dashboard: 'Панель управления',
    myFields: 'Мои поля',
    addField: 'Добавить поле',
    statistics: 'Статистика',
    totalEarnings: 'Общий доход',
    activeBookings: 'Активные брони',
    verifyBooking: 'Подтвердить бронь',
    enterVerificationCode: 'Введите код подтверждения',
    checkCode: 'Проверить код',
    codeCorrect: 'Код верный!',
    codeIncorrect: 'Код неверный!',
    attemptsLeft: 'Осталось попыток',
    
    // Add Field
    fieldName: 'Название поля',
    fieldDescription: 'Описание',
    pricePerHour: 'Цена в час',
    uploadPhotos: 'Загрузить фото',
    addFieldFee: 'Плата за добавление поля: 50,000 сум',
    submit: 'Отправить',
    
    // Advertisement
    promoteField: 'Рекламировать поле',
    selectPackage: 'Выберите пакет',
    oneDay: '1 день',
    threeDays: '3 дня',
    oneWeek: '1 неделя',
    twoWeeks: '2 недели',
    oneMonth: '1 месяц',
    threeDaysPro: '3 дня Pro',
    som: 'сум',
    purchase: 'Купить',
    
    // Common
    cancel: 'Отмена',
    save: 'Сохранить',
    edit: 'Редактировать',
    delete: 'Удалить',
    back: 'Назад',
    next: 'Далее',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    success: 'Успешно!',
  },
  en: {
    // Header
    home: 'Home',
    fields: 'Fields',
    myBookings: 'My Bookings',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    
    // Auth
    phoneNumber: 'Phone Number',
    enterPhone: 'Enter your phone number',
    sendCode: 'Send Code',
    verifyCode: 'Verify Code',
    enterSmsCode: 'Enter SMS code',
    verify: 'Verify',
    register: 'Register',
    firstName: 'First Name',
    lastName: 'Last Name',
    age: 'Age',
    email: 'Email',
    selectUserType: 'Select User Type',
    regularUser: 'Regular User',
    fieldOwner: 'Field Owner',
    
    // Home
    topFields: 'Top Rated Fields',
    featuredFields: 'Featured Fields',
    searchFields: 'Search fields...',
    filters: 'Filters',
    location: 'Location',
    priceRange: 'Price Range',
    rating: 'Rating',
    filter: 'Filter',
    sortBy: 'Sort by',
    found: 'Found',
    reset: 'Reset',
    cheap: 'Cheap',
    medium: 'Medium',
    expensive: 'Expensive',
    highestRated: 'Highest Rated',
    mostReviewed: 'Most Reviewed',
    lowestPrice: 'Lowest Price',
    highestPrice: 'Highest Price',
    allPrices: 'All Prices',
    
    // Field Details
    bookNow: 'Book Now',
    hourly: 'per hour',
    address: 'Address',
    availability: 'Availability',
    reviews: 'Reviews',
    
    // Booking
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    duration: 'Duration',
    hours: 'hours',
    totalPrice: 'Total Price',
    paymentMethod: 'Payment Method',
    confirmBooking: 'Confirm Booking',
    
    // Payment
    cardNumber: 'Card Number',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    payNow: 'Pay Now',
    other: 'Other',
    
    // Booking Confirmation
    bookingConfirmed: 'Booking Confirmed!',
    verificationCode: 'Verification Code',
    saveThisCode: 'Save this code and show it to the field owner',
    
    // Owner Dashboard
    dashboard: 'Dashboard',
    myFields: 'My Fields',
    addField: 'Add Field',
    statistics: 'Statistics',
    totalEarnings: 'Total Earnings',
    activeBookings: 'Active Bookings',
    verifyBooking: 'Verify Booking',
    enterVerificationCode: 'Enter verification code',
    checkCode: 'Check Code',
    codeCorrect: 'Code is correct!',
    codeIncorrect: 'Code is incorrect!',
    attemptsLeft: 'Attempts left',
    
    // Add Field
    fieldName: 'Field Name',
    fieldDescription: 'Description',
    pricePerHour: 'Price per Hour',
    uploadPhotos: 'Upload Photos',
    addFieldFee: 'Add Field Fee: 50,000 UZS',
    submit: 'Submit',
    
    // Advertisement
    promoteField: 'Promote Field',
    selectPackage: 'Select Package',
    oneDay: '1 Day',
    threeDays: '3 Days',
    oneWeek: '1 Week',
    twoWeeks: '2 Weeks',
    oneMonth: '1 Month',
    threeDaysPro: '3 Days Pro',
    som: 'UZS',
    purchase: 'Purchase',
    
    // Common
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success!',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'uz';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
