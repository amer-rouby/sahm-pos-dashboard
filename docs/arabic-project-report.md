# تقرير مشروع Sahm Food Smart POS Dashboard

## 1. ملخص المشروع

المشروع عبارة عن لوحة تشغيل ذكية لنظام POS داخل مطاعم Sahm Food. الفكرة الأساسية ليست بناء نظام POS كامل، ولكن إثبات قدرة الواجهة الأمامية على التعامل مع بيئة تشغيل حقيقية فيها طلبات مباشرة، تحديثات متزامنة، مساعد AI، ضغط مطبخ متغير، بحث سريع، ودعم انقطاع الاتصال.

المشروع معمول باستخدام Angular 22، ومقسم إلى مكونات مستقلة Standalone Components، مع استخدام Angular Signals لإدارة حالة الواجهة، وRxJS لمحاكاة الأحداث غير المتزامنة مثل تحديثات الطلبات، ضغط المطبخ، وتدفق ردود مساعد الذكاء الاصطناعي.

## 2. الهدف التجاري Business Goal

Sahm Food عندها فروع ومطاعم كثيرة، والكاشير ومدير الفرع والمطبخ وخدمة العملاء محتاجين شاشة واحدة تساعدهم يتابعوا الطلبات بسرعة وبدون ارتباك.

المشكلة التجارية التي يحلها المشروع:

- الطلبات تأتي من أكثر من قناة: داخل الفرع، توصيل، وأونلاين.
- حالة الطلب تتغير باستمرار.
- ضغط المطبخ يؤثر على أولوية الطلبات.
- الكاشير يحتاج اقتراحات ذكية مثل البيع الإضافي أو التحذير من الحساسية.
- الاتصال قد ينقطع مؤقتًا، ولازم النظام يحفظ الإجراءات ولا يكررها.
- البحث في المنتجات لازم يكون سريع ومناسب لاستخدام الكاشير تحت الضغط.

القيمة التجارية:

- تقليل التأخير في الطلبات.
- مساعدة الكاشير على اتخاذ قرارات أسرع.
- تحسين تجربة العميل.
- تقليل الأخطاء الناتجة عن الضغط أو انقطاع الاتصال.
- تجهيز أساس معماري قابل للتوسع لفروع وشاشات كثيرة.

## 3. أهم المزايا الموجودة في المشروع

### 3.1 Live Orders Workspace

يعرض الطلبات الحالية وحالتها:

- مستلم
- قيد التحضير
- جاهز
- تم التوصيل
- مكتمل

كل طلب يظهر معه:

- رقم الطلب
- اسم العميل
- قناة الطلب
- الأولوية
- المنتجات
- الوقت المتوقع
- إجمالي السعر

يوجد زر لتقدم حالة الطلب، والتحديثات تتم بشكل مباشر داخل الواجهة.

### 3.2 AI Order Assistant

كل طلب له مساعد ذكي يعرض توصيات مثل:

- تحذير حساسية
- بيانات توصيل ناقصة
- طلب متأخر يحتاج تصعيد
- اقتراح بيع إضافي

المساعد يحاكي حالات مهمة:

- تحميل
- تدفق تدريجي للرد
- نجاح
- فشل
- إعادة محاولة

هذا مهم لأنه يثبت أن الواجهة تتعامل مع AI responses غير مضمونة وقد تتأخر أو تفشل.

### 3.3 Kitchen Load Monitor

يوجد جزء خاص بضغط المطبخ يعرض:

- عدد التذاكر النشطة
- متوسط وقت التحضير
- مستوى الضغط: هادئ، مشغول، مضغوط

عندما يزيد ضغط المطبخ، بعض الطلبات تتحول تلقائيًا إلى متأخرة، وتتغير الأولوية بدون إعادة تحميل الصفحة.

### 3.4 Advanced Product Search

يوجد بحث سريع في المنتجات يدعم:

- البحث الفوري مع debounce
- فلترة حسب الفئة
- التنقل بالكيبورد
- آخر عمليات البحث
- نتائج محدودة وواضحة للحفاظ على الأداء

هذا يحاكي تجربة كاشير يحتاج إضافة منتج بسرعة أثناء وجود عميل أمامه.

### 3.5 Offline Support

يوجد زر لتجربة وضع offline.

عند قطع الاتصال:

- الإجراءات لا تضيع.
- يتم وضعها في queue.
- الضغط المتكرر لا يكرر نفس العملية.
- عند الرجوع online تتم المزامنة.

هذا يثبت وجود optimistic actions وdeduplication وrecovery flow.

### 3.6 دعم العربي والإنجليزي

الواجهة تدعم لغتين:

- العربية RTL بشكل افتراضي
- الإنجليزية LTR بزر تبديل

هذا مناسب جدًا لأن المنتج في مصر/السوق المحلي، وفي نفس الوقت يسهل على المراجع التقني قراءة الواجهة بالإنجليزية.

### 3.7 Light/Dark Theme

يوجد تبديل بين:

- Light mode
- Dark mode

الثيم مبني باستخدام CSS variables، وهذا يجعل التصميم قابل للتوسع وسهل الصيانة.

## 4. المعمارية التقنية Technical Architecture

### 4.1 Angular Version

المشروع محدث إلى Angular 22.

متطلبات التشغيل:

- Node 24.15.0 أو أحدث، أو Node 22.22.3 أو أحدث
- npm

### 4.2 Standalone Components

تم تقسيم الواجهة إلى Components مستقلة بدل وضع كل شيء داخل AppComponent.

المكونات الرئيسية:

- HeaderControlsComponent
- MetricsSummaryComponent
- OrdersWorkspaceComponent
- KitchenMonitorComponent
- AiAssistantPanelComponent
- ProductSearchPanelComponent
- OfflineQueueBannerComponent

AppComponent أصبح مجرد shell يجمع المكونات معًا، وهذا أفضل للقراءة والاختبار والتوسع.

### 4.3 Core Layer

داخل core يوجد:

- models.ts: تعريفات TypeScript للطلبات والمنتجات والحالات.
- mock-data.ts: بيانات تجريبية للطلبات والمنتجات.
- fake-pos-api.service.ts: محاكاة backend وWebSocket وAI streaming.
- pos-store.service.ts: طبقة إدارة الحالة والتنسيق بين الخدمات والواجهة.
- ui-preferences.service.ts: اللغة، الثيم، والترجمات.
- order-utils.ts: دوال مساعدة لحالة الطلب وضغط المطبخ.

### 4.4 Feature Layer

داخل features يوجد:

- orders: عرض الطلبات وتقدم الحالة.
- kitchen: مراقبة ضغط المطبخ.
- assistant: مساعد AI.
- search: البحث في المنتجات.
- offline: queue عند انقطاع الاتصال.
- metrics: ملخص الأرقام.
- layout: الهيدر والتحكم في اللغة والثيم والاتصال.

### 4.5 State Management

استخدمت Angular Signals لحالة الواجهة مثل:

- اللغة
- الثيم
- الطلبات
- حالة الاتصال
- نتائج البحث
- الإجراءات المعلقة
- نتائج مساعد AI

واستخدمت RxJS للأحداث غير المتزامنة مثل:

- timers
- simulated WebSocket updates
- AI streaming
- debounce في البحث
- retry/error handling

سبب الاختيار:

- Signals مناسبة لحالة UI مباشرة وسريعة.
- RxJS مناسب للأحداث المتدفقة وغير المتزامنة.
- الحل أخف من NgRx لمشروع challenge ولكنه قابل للتطوير لاحقًا.

## 5. الأداء Performance

تم مراعاة الأداء من خلال:

- ChangeDetectionStrategy.OnPush
- استخدام Signals لتقليل التحديثات غير الضرورية
- track في @for loops
- debounce في البحث
- فصل منطق الأعمال خارج المكونات
- وضع search logic في دالة مستقلة قابلة للاختبار
- تحديد عدد نتائج البحث المعروضة

## 6. التعامل مع الأخطاء Error Handling

يوجد أكثر من سيناريو خطأ:

- AI assistant قد يفشل.
- تظهر رسالة خطأ.
- يوجد زر Retry.
- عند offline يتم حفظ الإجراء بدل فقدانه.
- عند reconnect يتم تفريغ queue.

هذا يوضح أن التطبيق لا يفترض أن كل request سينجح دائمًا.

## 7. الاختبارات Testing

تمت إضافة unit tests تغطي:

- search filtering and highlighting
- order status transitions
- kitchen pressure logic
- AI failure handling
- offline queue deduplication

أوامر التحقق:

```bash
npm test
npm run build
```

نتيجة الاختبارات الحالية:

- 4 test files passed
- 7 tests passed

## 8. ما الذي تم تبسيطه عن قصد

لأن الهدف هو إثبات الarchitecture وليس بناء منتج كامل، تم تبسيط بعض الأجزاء:

- لا يوجد backend حقيقي.
- لا يوجد authentication.
- لا يوجد routing مع صفحات كثيرة.
- offline queue موجودة في memory وليست IndexedDB.
- لا يوجد e2e tests حتى الآن.

هذه التبسيطات مقبولة لأنها تحافظ على تركيز المشروع على الfrontend architecture والتفاعل المعقد.

## 9. ما الذي يمكن تحسينه لاحقًا

لو كان هناك وقت أكثر:

- إضافة IndexedDB لحفظ offline queue.
- إضافة Playwright e2e tests.
- إضافة virtual scroll للطلبات والمنتجات الكبيرة.
- تحويل كل feature إلى lazy route.
- استخدام MSW أو JSON Server كمحاكاة backend أكثر واقعية.
- إضافة role-based views للكاشير والمدير والمطبخ.
- إضافة accessibility audit كامل.

## 10. طريقة شرح الفيديو

الفيديو المطلوب من 12 إلى 20 دقيقة. الأفضل تقسيمه كالتالي:

### الجزء الأول: Product Demo - من 4 إلى 6 دقائق

ابدأ بالكلام التالي:

"المشروع عبارة عن Smart POS Dashboard لمطاعم Sahm Food. الهدف منه هو إثبات قدرة الواجهة على التعامل مع طلبات مباشرة، مساعد AI، ضغط مطبخ، بحث سريع، ودعم offline، وليس بناء نظام POS كامل."

اعرض التالي:

1. الواجهة العربية RTL.
2. زر تبديل اللغة إلى الإنجليزية.
3. زر Light/Dark mode.
4. قائمة الطلبات وحالاتها.
5. اضغط Advance على طلب.
6. اعرض AI assistant واضغط Retry إذا ظهر خطأ.
7. اعرض Kitchen Load Monitor.
8. جرّب البحث عن منتج.
9. افصل الاتصال Go offline، اضغط Advance، ثم Reconnect.

### الجزء الثاني: Business Explanation - من 2 إلى 3 دقائق

اشرح:

- لماذا يحتاج الكاشير شاشة سريعة.
- كيف يساعد AI في تقليل الأخطاء.
- كيف يؤثر ضغط المطبخ على الأولويات.
- لماذا offline support مهم في الفروع.
- لماذا العربي والإنجليزي مهمان للسوق والمراجعة.

### الجزء الثالث: Technical Deep Dive - من 5 إلى 7 دقائق

افتح الكود واشرح:

1. AppComponent أصبح shell فقط.
2. كل feature لها component منفصل.
3. PosStoreService هو مركز orchestration.
4. FakePosApiService يحاكي backend وAI streaming.
5. UiPreferencesService مسؤول عن اللغة والثيم.
6. OfflineActionQueue يمنع duplicate actions.
7. search-engine.ts يحتوي منطق البحث بعيدًا عن الcomponent.

جملة مهمة تقولها:

"I intentionally kept business logic outside the components. Components are focused on rendering and user interaction, while services own state orchestration and asynchronous behavior."

### الجزء الرابع: Testing and Trade-offs - من 2 إلى 3 دقائق

اعرض:

```bash
npm test
npm run build
```

واشرح:

- الاختبارات تغطي أهم business logic.
- لا يوجد backend حقيقي لأن المطلوب frontend architecture.
- يمكن استبدال mock backend بـ real API لاحقًا بدون تغيير كبير في الUI.

## 11. سكريبت مختصر للفيديو

يمكنك استخدام هذا الكلام أثناء التسجيل:

"Hello, this is my implementation for Sahm Food Smart POS Dashboard. The project is built with Angular 22 using standalone components, Angular Signals, and RxJS. The goal is to demonstrate a scalable frontend architecture for a real restaurant POS workspace with live orders, AI recommendations, kitchen load monitoring, advanced product search, and offline recovery."

ثم بالعربي:

"الواجهة افتراضيًا باللغة العربية وRTL لأن المنتج موجه لسوق محلي، وفي نفس الوقت يوجد دعم للإنجليزية لتسهيل المراجعة التقنية. يوجد أيضًا light and dark theme باستخدام CSS variables."

ثم:

"The AppComponent is intentionally thin. It only composes the dashboard. Each business area is isolated into its own standalone component, and the state coordination is handled by PosStoreService."

ثم:

"For asynchronous behavior, I used RxJS timers and streams to simulate live order updates, kitchen load changes, and AI streaming responses. The UI handles loading, streaming, error, and retry states."

ثم:

"Offline actions are queued optimistically and duplicate actions are prevented. When the connection is restored, queued actions are flushed safely."

ثم:

"Finally, I added unit tests for search, order status updates, AI failure handling, kitchen pressure logic, and offline queue behavior."

## 12. خطوات التشغيل قبل التسجيل

داخل فولدر المشروع:

```bash
cd E:\Backend\Projects\sahm-pos-dashboard
node --version
npm install --legacy-peer-deps
npm test
npm run build
npm start
```

افتح:

```text
http://127.0.0.1:4205/
```

## 13. خطوات رفع المشروع على GitHub

1. افتح GitHub.
2. اعمل Repository جديد باسم مناسب مثل:

```text
sahm-food-smart-pos-dashboard
```

3. داخل فولدر المشروع شغل:

```bash
git init
git add .
git commit -m "Build smart POS dashboard challenge"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

مهم جدًا:

- لا ترفع node_modules.
- تأكد أن .gitignore موجود.
- تأكد أن README موجود وواضح.

## 14. خطوات السابميشن على Code Quests

جهز الروابط التالية:

- GitHub repository link
- Video walkthrough link

الفيديو يمكن رفعه على:

- Google Drive
- YouTube unlisted
- Loom

عند الضغط على Submit في المنصة:

1. ضع رابط GitHub.
2. ضع رابط الفيديو.
3. لو يوجد خانة ملاحظات، اكتب:

```text
The project is built with Angular 22 using standalone components, Signals, and RxJS. It includes Arabic/English support, light/dark themes, live order simulation, AI assistant states, kitchen load monitoring, advanced search, offline queue recovery, unit tests, and a documented architecture.
```

## 15. نقاط مهمة تقولها لو سألوك في المراجعة

### لماذا Angular Signals؟

لأنها مناسبة لحالة الواجهة المتغيرة بسرعة وتقلل re-render غير الضروري.

### لماذا RxJS؟

لأن التحديثات الحية وAI streaming والdebounced search كلها أحداث غير متزامنة، وRxJS مناسب جدًا لها.

### لماذا لم تستخدم NgRx؟

لأن المشروع challenge متوسط الحجم. استخدام Signals مع Services أبسط وأكثر وضوحًا، ويمكن الانتقال إلى NgRx Signal Store لاحقًا إذا كبر النظام.

### لماذا mock backend؟

لأن المطلوب تقييم frontend architecture. المحاكاة تسمح بإظهار polling وstreaming وfailure وretry بدون انتظار backend حقيقي.

### كيف سيتوسع المشروع؟

يمكن تقسيم كل feature إلى lazy route، وإضافة API layer حقيقي، وتخزين offline queue في IndexedDB، وإضافة e2e tests.

## 16. Checklist قبل التسليم

- npm test يعمل بنجاح.
- npm run build يعمل بنجاح.
- npm start يعمل ويعرض الصفحة.
- الواجهة تعمل بالعربي والإنجليزي.
- Light/Dark mode يعمل.
- Offline/Reconnect يعمل.
- AI Retry يعمل.
- README محدث.
- الفيديو واضح وصوته مسموع.
- روابط GitHub والفيديو متاحة بدون private access.
