<script setup>
function smoothScroll(id) {
    document.body.click();
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
}
</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="landing-wrapper overflow-hidden">
            <header class="bg-white shadow-lg h-24 hidden md:flex">
                <a href="" class="border flex-shrink-0 flex items-center justify-center px-4 lg:px-6 xl:px-8">
                    <img style="width: 50%" class="" src="/public/demo/images/logo.png" alt="" />
                </a>
                <nav class="header-links contents font-semibold text-base lg:text-lg">
                    <ul class="flex items-center ml-4 xl:ml-8 mr-auto">
                        <li class="p-3 xl:p-6">
                            <a href="">
                                <span>تواصل معنا</span>
                            </a>
                        </li>
                        <li class="p-3 xl:p-6">
                            <a href="">
                                <span>KEEP SPACE عن</span>
                            </a>
                        </li>
                        <li class="p-3 xl:p-6">
                            <a href="">
                                <span>مشاريعنا</span>
                            </a>
                        </li>
                        <li class="p-3 xl:p-6 active">
                            <a href="">
                                <span>الرئيسية</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <nav class="hidden xl:contents">
                    <ul class="flex items-center mr-4 lg:mr-6 xl:mr-8">
                        <li class="p-1">
                            <a href="" class="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                                <svg class="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path
                                        fill="currentColor"
                                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                                    ></path>
                                </svg>
                            </a>
                        </li>
                        <li class="p-1">
                            <a href="" class="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                                <svg class="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                                </svg>
                            </a>
                        </li>
                        <li class="p-1">
                            <a href="" class="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                                <svg class="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path
                                        fill="currentColor"
                                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                                    ></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div class="border flex items-center px-4 lg:px-6 xl:px-8">
                    <a href="" class="mr-4 lg:mr-6 xl:mr-8">
                        <svg class="h-6 xl:h-8" aria-hidden="true" focusable="false" data-prefix="far" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                fill="currentColor"
                                d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"
                            ></path>
                        </svg>
                    </a>
                    <router-link to="/join">
                        <button style="background-color: #73ec8b; color: #091057 !important" class="text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded">الإنظمام</button>
                    </router-link>
                    <div style="margin-right: 10px !important"></div>
                    <router-link to="/auth/login">
                        <button style="background-color: #091057" class="text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded">تسجيل دخول</button>
                    </router-link>
                </div>
            </header>

            <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden">
                <div class="mx-6 md:mx-20 mt-0 md:mt-6">
                    <h1 style="color: #00ff9c" class="text-6xl mb-1 text-center">KEEP SPACE</h1>
                    <h1 style="color: #b6ffa1" class="text-3xl font-bold text-center leading-tight">WHERE EVERYONE GETS A BARGAIN</h1>
                    <p style="color: #b6ffa1" class="font-normal text-center mb-5 text-4xl leading-normal md:mt-4">حيـث يحصـل الجميـع علـى صفقــة جيـــدة</p>
                </div>
                <div class="flex justify-center md:justify-end">
                    <img src="/public/demo/cover.svg" alt="Hero Image" style="width: 50%" class="" />
                </div>
            </div>

            <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
                <div class="grid grid-cols-12 gap-4 justify-center">
                    <div class="col-span-12 text-center mt-20 mb-6">
                        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">KEEP SPACE FEATURES</div>
                        <span class="text-muted-color text-2xl">
                            Keep Space! Keep Space مرحباً بكم في
                            <br />
                            هو الحل الأمثل لتخزين منتجاتك وأثاثك وغيرها من الأشياء بكل أمان وسهولة. سواء كنت تاجرًا تبحث عن مكان لتخزين بضائعك أو فردًا يحتاج إلى مساحة إضافية، نحن هنا لنقدم لك أفضل خدمات التخزين.
                        </span>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-users !text-2xl text-yellow-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">أمان وحماية</h5>
                                <span class="text-surface-600 dark:text-surface-200 mb-5">خدماتنا تتضمن أحدث أنظمة الأمان للحفاظ على ممتلكاتك آمنة على مدار الساعة</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-palette !text-2xl text-cyan-700"></i>
                                </div>
                                <h5 class="mb-2 text-surface-900 dark:text-surface-0">سهولة الوصول</h5>
                                <span class="text-surface-600 dark:text-surface-200"> يمكنك الوصول إلى مساحتك التخزينية بسهولة وفي أي وقت يناسبك </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-map !text-2xl text-indigo-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">تنوع المساحات</div>
                                <span class="text-surface-600 dark:text-surface-200">نوفر مساحات تخزينية متعددة الأحجام لتناسب جميع احتياجاتك، سواء كانت كبيرة أو صغيرة</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-slate-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-id-card !text-2xl text-slate-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">تكلفة مناسبة</div>
                                <span class="text-surface-600 dark:text-surface-200">أسعارنا تنافسية وتناسب جميع الميزانيات</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-orange-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-star !text-2xl text-orange-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">خدمة عملاء متميزة</div>
                                <span class="text-surface-600 dark:text-surface-200">فريقنا متواجد للإجابة على استفساراتك وتقديم الدعم المطلوب في أي وقت</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-pink-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-moon !text-2xl text-pink-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">إدارة فعالة</div>
                                <span class="text-surface-600 dark:text-surface-200">نظام إدارة مخازن متطور يتيح لك تتبع وتحديث مخزونك بسهولة</span>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-teal-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-shopping-cart !text-2xl text-teal-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Ready to Use</div>
                                <span class="text-surface-600 dark:text-surface-200">Mauris sit amet massa vitae.</span>
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-blue-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-globe !text-2xl text-blue-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Modern Practices</div>
                                <span class="text-surface-600 dark:text-surface-200">Elementum nibh tellus molestie nunc non.</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg-4 mt-6 lg:mt-0">
                        <div
                            style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))"
                        >
                            <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
                                <div class="flex items-center justify-center bg-purple-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                    <i class="pi pi-fw pi-eye !text-2xl text-purple-700"></i>
                                </div>
                                <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Privacy</div>
                                <span class="text-surface-600 dark:text-surface-200">Neque egestas congue quisque.</span>
                            </div>
                        </div>
                    </div> -->

                    <div
                        class="col-span-12 mt-20 mb-20 p-2 md:p-20"
                        style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)"
                    >
                        <div class="flex flex-col justify-center items-center text-center px-4 py-4 md:py-0">
                            <div class="text-gray-900 mb-2 text-3xl font-semibold">؟ KEEP SPACE لماذا تختار</div>

                            <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-6" style="max-width: 800px">
                                الأمان والموثوقية: جميع منشآتنا مزودة بأحدث تقنيات الأمان لضمان حماية ممتلكاتك. التنوع في الخدمات: نقدم حلول تخزين مخصصة تناسب التجار والأفراد على حد سواء. الراحة والمرونة: خدماتنا مصممة لتكون مرنة وتتماشى مع جدولك
                                الزمني<br />
                                سهولة الاستخدام: واجهة مستخدم بسيطة وسهلة الاستخدام لتساعدك على إدارة مخزونك بكفاءة
                                <br />
                                الدعم الفني: فريق دعم متواجد على مدار الساعة لتقديم المساعدة الفنية والإجابة على استفساراتك.
                            </p>
                            <img src="/demo/images/logo.png" class="mt-6" alt="Company logo" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
                <div class="text-center mb-6">
                    <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">باقات الإنظمام</div>
                    <span class="text-muted-color text-2xl">Pricing Package</span>
                </div>

                <div class="grid grid-cols-8 gap-4 justify-between mt-20 md:mt-0">
                    <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                        <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">الأفراد</div>
                            <img src="/demo/images/landing/free.svg" class="w-4/12 mx-auto" alt="free" />
                            <div class="my-8 flex flex-col items-center gap-4">
                                <div class="flex items-center">
                                    <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">مجاني</span>
                                    <span class="text-surface-600 dark:text-surface-200">لكل شهر</span>
                                </div>
                                <Button label="إشترك في الخدمة" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="text-right my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                                <li class="py-2">
                                    <span class="text-xl leading-normal">تخزين العناصر</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                                <li class="py-2">
                                    <span class="text-xl leading-normal">ادراج تصنيفات</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                                <li class="py-2">
                                    <span class="text-xl leading-normal">ادارة العناصر بالكامل</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                                <li class="py-2">
                                    <span class="text-xl leading-normal">تقارير</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                        <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                            <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">التجار</div>
                            <img src="/demo/images/landing/company.svg" class="w-10/12 mx-auto" alt="enterprise" />
                            <div class="my-8 flex flex-col items-center gap-4">
                                <div class="flex items-center">
                                    <span class="text-3xl font-bold mr-2 text-surface-900 dark:text-surface-0">تواصل مع قسم المالية</span>
                                    <span class="text-surface-600 dark:text-surface-200">إشتراك شهري</span>
                                </div>
                                <Button label="إشترك في الخدمة" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                            </div>
                            <Divider class="w-full bg-surface-200"></Divider>
                            <ul class="text-right my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                                <li class="py-2">
                                    <span class="text-xl leading-normal">تخزين العناصر وتحديد الاسعار</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                                <li class="py-2">
                                    <span class="text-xl leading-normal">إدراج التصنيفات</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                                <li class="py-2">
                                    <span class="text-xl leading-normal">إدارة العناصر بالكامل</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                                <li class="py-2">
                                    <span class="text-xl leading-normal">تقارير</span>
                                    <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-6 px-6 mx-0 mt-20 lg:mx-20">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-2">
                        <a @click="smoothScroll('#home')" class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-4 cursor-pointer">
                            <img src="/demo/images/logo.png" class="mt-6" alt="Company logo" data-v-5331549c="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-links li span {
    position: relative;
    z-index: 0;
}

.header-links li span::before {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: 2px;
    left: -4px;
    right: -4px;
    display: block;
    height: 6px;
}

.header-links li.active span::before {
    background-color: #00ff9c;
    width: 70px;
}

.header-links li:not(.active):hover span::before {
    background-color: #ccc;
}
</style>
