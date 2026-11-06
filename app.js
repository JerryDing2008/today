// =========================
// Today V1
// =========================

console.log(
    "window.supabase =",
    window.supabase
);

const SUPABASE_URL =
"https://ithkvgyjvrbztmwxhyya.supabase.co";

const SUPABASE_KEY =
"sb_publishable_VrceITwhVpJksr7-8WTrMQ_J92BhKwQ";

const sbClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log(
    "Supabase Client Created",
    sbClient
);

async function updateUserUI(){

    const {
        data:{ session }
    } =
    await sbClient.auth.getSession();

    if(session){

        accountBtn.textContent =
            "✓";

        accountCard.innerHTML = `

            <div class="profile-name">

                ${
                    session.user.email
                    .split("@")[0]
                }

            </div>

            <div class="profile-bio">

                Build first.
                Polish later.

            </div>

            <button
                id="logoutBtn">

                Logout

            </button>

        `;

        document
        .getElementById(
            "logoutBtn"
        )
        .addEventListener(

            "click",

            async ()=>{

                await sbClient
                    .auth
                    .signOut();

                location.reload();

            }

        );

    }else{

        accountBtn.textContent =
            "LOGIN";

        accountCard.innerHTML = `

        

            <input
                id="emailInput"
                type="email"
                placeholder="Email">

            <input
                id="passwordInput"
                type="password"
                placeholder="Password">

            <button
                id="signupBtn">

                Sign Up

            </button>

        `;
        document
        .getElementById("signupBtn")
        .addEventListener(

            "click",

            async ()=>{

                const email =
                    document
                    .getElementById(
                        "emailInput"
                    )
                    .value
                    .trim();

                const password =
                    document
                    .getElementById(
                        "passwordInput"
                    )
                    .value
                    .trim();

                const { error } =

                await sbClient
                .auth
                .signUp({

                    email,

                    password

                });

                if(error){

                    alert(
                        error.message
                    );

                    return;
                }

                alert(
                    "注册成功"
                );

            }

        );


    }

}


// -------------------------
// DOM
// -------------------------

const STORAGE_KEY = "today-v1";

const accountBtn =
document.getElementById(
    "accountBtn"
);


const taskInput =
document.getElementById(
    "taskInput"
);

const addBtn =
document.getElementById(
    "addBtn"
);

const todoList =
document.getElementById(
    "todoList"
);

const archiveList =
document.getElementById(
    "archiveList"
);

const dateLabel =
document.getElementById(
    "dateLabel"
);

const menuBtn =
document.getElementById(
    "menuBtn"
);

const sidebar =
document.getElementById(
    "sidebar"
);

const overlay =
document.getElementById(
    "overlay"
);

const backBtn =
document.getElementById(
    "backBtn"
);

const todayPage =
document.getElementById(
    "todayPage"
);

const archivePage =
document.getElementById(
    "archivePage"
);

const detailPanel =
document.getElementById(
    "detailPanel"
);

const authPanel =
document.getElementById(
    "authPanel"
);

const emailInput =
document.getElementById(
    "emailInput"
);

const passwordInput =
document.getElementById(
    "passwordInput"
);

const loginBtn =
document.getElementById(
    "loginBtn"
);

const signupBtn =
document.getElementById(
    "signupBtn"
);

accountBtn.addEventListener(

    "click",

    ()=>{

        authPanel.classList.toggle(
            "hidden"
        );

    }
);

// // signupBtn.addEventListener(

//     "click",

//     async ()=>{

//         const email =
//             emailInput.value.trim();

//         const password =
//             passwordInput.value.trim();

//         if(
//             !email ||
//             !password
//         ){

//             alert(
//                 "请输入邮箱和密码"
//             );

//             return;
//         }

//         const {

//             data,

//             error

//         } = await sbClient.auth.signUp({

//             email,

//             password

//         });

//         if(error){

//             alert(
//                 error.message
//             );

//             return;
//         }

//         alert(
//             "注册成功，请检查邮箱验证。"
//         );

//         console.log(
//             data
//         );
//     }
// );

accountBtn.addEventListener(

    "click",

    async ()=>{

        const email =
            document
            .getElementById(
                "emailInput"
            )
            .value
            .trim();

        const password =
            document
            .getElementById(
                "passwordInput"
            )
            .value
            .trim();

        if(
            !email ||
            !password
        ){

            alert(
                "请输入邮箱和密码"
            );

            return;
        }

        const {

            data,

            error

        }
        =
        await sbClient
        .auth
        .signInWithPassword({

            email,

            password

        });

        if(error){

            alert(
                error.message
            );

            return;
        }

        updateUserUI();

    }

);


// -------------------------
// 状态
// -------------------------
let selectedTaskId = null;
let state = {

    currentDate: "",

    today: [],

    someday: [],

    archive: {}
};
let currentMode =
    "today";

// -------------------------
// 日期
// -------------------------

function getTodayString(){

    const now =
        new Date();

    return now
        .toISOString()
        .split("T")[0];
}

// -------------------------
// 保存
// -------------------------

function saveState(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            state
        )
    );
}

// -------------------------
// 加载
// -------------------------

function loadState(){

    const raw =
        localStorage.getItem(
            STORAGE_KEY
        );

    if(raw){

        state =
            JSON.parse(raw);

        if(!state.someday){

            state.someday = [];

            saveState();
        }

    }else{

        state = {

            currentDate:
                getTodayString(),

            today: [],

            someday: [],

            archive: {}
        };

        saveState();
    }

    checkDateChange();
}

// -------------------------
// 跨天归档
// -------------------------

function checkDateChange(){

    const today =
        getTodayString();

    if(
        state.currentDate !==
        today
    ){

        if(
            state.today.length
        ){

            state.archive[
                state.currentDate
            ] =

            JSON.parse(
                JSON.stringify(
                    state.today
                )
            );
        }

        state.currentDate =
            today;

        state.today = [];

        saveState();
    }
}

// -------------------------
// 日期显示
// -------------------------

function renderDate(){

    dateLabel.textContent =
        state.currentDate;
}

// -------------------------
// Todo
// -------------------------

function renderTodos(){

    todoList.innerHTML = "";

        const tasks =

        currentMode ===
        "today"

        ? state.today

        : state.someday;

    tasks.forEach(

        task=>{

            const li =
            document.createElement(
                "li"
            );

            li.className =
                "todo-item";

            if(task.done){

                li.classList.add(
                    "done"
                );
            }
            if(
                task.id ===
                selectedTaskId
            ){

                li.classList.add(
                    "selected"
                );
            }

            li.innerHTML = `

                <div
                 class="check">
                </div>

                <div
                 class="text">

                    ${task.text}

                </div>

                <button
                 class="delete-btn">

                    ×

                </button>

            `;

            // 完成
            
            li.querySelector(
            ".check"
        )
        .addEventListener(

            "click",

            ()=>{

                const newState =
                    !task.done;
                    if(!task.done){

                    const rect =
                    li.querySelector(
                        ".check"
                    ).getBoundingClientRect();

                    for(let i=0;i<6;i++){

                        const spark =
                        document.createElement(
                            "div"
                        );

                        spark.className =
                            "spark";

                        const colors = [

                            "#4f7cff",

                            "#ffb800",

                            "#ff6b6b",

                            "#7ed957",

                            "#ff87d7",

                            "#8a7dff"
                        ];

                        spark.style.background =

                            colors[
                                Math.floor(
                                    Math.random() *
                                    colors.length
                                )
                            ];

                        spark.style.left =
                            rect.left + 12 + "px";

                        spark.style.top =
                            rect.top + 12 + "px";

                        spark.style.setProperty(

                            "--x",

                            (Math.random()*100-50)
                            +"px"

                        );

                        spark.style.setProperty(

                            "--y",

                            (Math.random()*100-50)
                            +"px"

                        );

                        document.body.appendChild(
                            spark
                        );

                        setTimeout(
                            ()=>spark.remove(),
                            500
                        );
                    }
                }

                li.classList.toggle(
                    "done"
                );

                task.done =
                    newState;

                saveState();

                updateTodoInCloud(

                    task.id,

                    {
                        done: newState
                    }

                );
            }
        );;

            // 删除

            li.querySelector(
                ".delete-btn"
            )
            .addEventListener(

                "click",

                ()=>{

                    li.classList.add(
                        "removing"
                    );

                    setTimeout(()=>{

                        deleteTodoFromCloud(
                            task.id
                        );

                        const target =

                            currentMode ===
                            "today"

                            ? state.today

                            : state.someday;

                        const updated =

                            target.filter(

                                t=>

                                t.id !==
                                task.id
                            );

                        if(

                            currentMode ===
                            "today"
                        ){

                            state.today =
                                updated;

                        }else{

                            state.someday =
                                updated;
                        }

                        saveState();

                        renderTodos();

                    },300);
                }
            );
            li.querySelector(
                ".text"
            )
            .addEventListener(

                "click",

                ()=>{

                    selectedTaskId =
                        task.id;

                    document
                    .querySelectorAll(
                        ".todo-item"
                    )
                    .forEach(
                        item =>
                        item.classList.remove(
                            "selected"
                        )
                    );

                    li.classList.add(
                        "selected"
                    );

                    detailPanel.innerHTML = `

                    <div class="detail-content-fade">

                        <div class="detail-title">

                            ${task.text}

                        </div>

                        <textarea
                            id="detailInput"
                            class="detail-input"
                            placeholder="点击添加说明..."
                        >${task.detail || ""}</textarea>

                    </div>

                    `;
                    detailPanel.classList.remove(
                        "detail-fade"
                    );

                    void detailPanel.offsetWidth;

                    detailPanel.classList.add(
                        "detail-fade"
                    );

                    const detailInput =
                    document.getElementById(
                        "detailInput"
                    );

                    detailInput.addEventListener(

                        "blur",

                        async ()=>{

                            console.log(task);
                            task.detail =
                                detailInput.value;

                            saveState();

                            await updateTodoInCloud(

                                task.id,

                                {
                                    detail:
                                        task.detail
                                }

                            );

                        }

                    );
                    

                    

                    

                }
            );
            todoList.appendChild(
                li
            );
        }
    );
}

// -------------------------
// 添加事项
// -------------------------
async function saveTodoToCloud(task){

    console.log("开始上传");

    const {
        data:{ session }
    } =
    await sbClient.auth.getSession();

    console.log(session);

    if(!session){

        return;
    }

    await sbClient

        .from("todo")

        .insert({

            user_id:
                session.user.id,

            text:
                task.text,

            detail:
                task.detail,

            done:
                task.done,

            mode:
                currentMode

        });

    console.log(JSON.stringify(data,null,2));
    console.log(data[0]);
    console.log("ERROR", error);

    if(data){

        state.today = data
            .filter(
                todo => todo.mode === "today"
            )
            .map(
                todo => ({
                    id: todo.id,
                    text: todo.text,
                    detail: todo.detail || "",
                    done: todo.done
                })
            );

        state.someday = data
            .filter(
                todo => todo.mode === "someday"
            )
            .map(
                todo => ({
                    id: todo.id,
                    text: todo.text,
                    detail: todo.detail || "",
                    done: todo.done
                })
            );

        renderTodos();
    }

}

async function updateTodoInCloud(
    id,
    fields
){

    console.log(
        "UPDATE",
        id,
        fields
    );

    const { data,error } =

    await sbClient

        .from("todo")

        .update(
            fields
        )

        .eq("id", id)

        .select();

    console.log(
        "UPDATED DATA",
        data
    );

    console.log(
        "UPDATE ERROR",
        error
    );

}

async function deleteTodoFromCloud(id){

    const { error } =

    await sbClient

        .from("todo")

        .delete()

        .eq("id", id);

    console.log(
        "DELETE ERROR",
        error
    );
}



async function loadTodosFromCloud(){

    const {
        data:{ session }
    } =
    await sbClient.auth.getSession();

    if(!session){

        return;
    }

    const { data, error } =
    await sbClient

        .from("todo")

        .select("*");

    console.log("RAW", data);

    if(data){

        console.log("MODES",
            data.map(
                t => t.mode
            )
        );

    }

    console.log("TODOS", data);
    console.log("ERROR", error);

    if(data){

            state.today = data
                .filter(
                    todo => todo.mode === "today"
                )
                .map(
                    todo => ({
                        id: todo.id,
                        text: todo.text,
                        detail: todo.detail || "",
                        done: todo.done
                    })
                );

            state.someday = data
                .filter(
                    todo => todo.mode === "someday"
                )
                .map(
                    todo => ({
                        id: todo.id,
                        text: todo.text,
                        detail: todo.detail || "",
                        done: todo.done
                    })
                );

        renderTodos();

    }

}


function addTask(){

    const text =
        taskInput.value.trim();

    if(!text){

        return;
    }

    const target =

        currentMode ===
        "today"

        ? state.today

        : state.someday;

    const newTask = {

        id:
            Date.now(),

        text,

        detail:"",

        done:false
    };

    target.unshift(
        newTask
    );

    saveTodoToCloud(
        newTask
    );


    taskInput.value = "";

    saveState();

    renderTodos();

    const firstItem =
    document.querySelector(
        ".todo-item"
    );

    if(firstItem){

        firstItem.classList.add(
            "new-item"
        );
    }
}

addBtn.addEventListener(

    "click",

    addTask
);

const somedayBtn =
document.getElementById(
    "somedayBtn"
);

const pageTitle =
document.getElementById(
    "pageTitle"
);

somedayBtn.addEventListener(

    "click",

    ()=>{

        if(
            currentMode ===
            "today"
        ){

            currentMode =
                "someday";

            pageTitle.textContent =
                "Someday";

            pageTitle.classList.remove(
                "title-switch"
            );

            void pageTitle.offsetWidth;

            pageTitle.classList.add(
                "title-switch"
            );

        }else{

            currentMode =
                "today";

            pageTitle.textContent =
                "Today";

            pageTitle.classList.remove(
                "title-switch"
            );

            void pageTitle.offsetWidth;

            pageTitle.classList.add(
                "title-switch"
            );
        }

        
         selectedTaskId = null;

        detailPanel.innerHTML = `

        <div class="empty-detail detail-content-fade">

            <div class="empty-title">

                ${
                    currentMode === "today"
                    ? "Today"
                    : "Someday"
                }

            </div>

            <div class="empty-subtitle">

                选择一个待办事项

            </div>

        </div>

        `;           

        renderTodos();
    }
);  

taskInput.addEventListener(

    "keydown",

    e=>{

        if(
            e.key === "Enter"
        ){

            addTask();
        }
    }
);

// -------------------------
// Archive
// -------------------------

function renderArchive(){

    archiveList.innerHTML = "";

    const dates =
    Object.keys(
        state.archive
    ).sort().reverse();

    if(
        dates.length === 0
    ){

        archiveList.innerHTML =

        `
        <div class="archive-item">
            暂无历史记录
        </div>
        `;

        return;
    }

    dates.forEach(

        date=>{

            const item =
            document.createElement(
                "div"
            );

            item.className =
                "archive-item";

            item.innerHTML =

            `
            <strong>
            ${date}
            </strong>
            `;

            item.addEventListener(

                "click",

                ()=>{

                    openArchiveDay(
                        date
                    );
                }
            );

            archiveList
            .appendChild(
                item
            );
        }
    );
}

// -------------------------
// 查看历史
// -------------------------

function openArchiveDay(date){

    const tasks =
        state.archive[date];

    archiveList.innerHTML = "";

    const back =
        document.createElement(
            "div"
        );

    back.className =
        "archive-item";

    back.textContent =
        "← 返回";

    back.addEventListener(

        "click",

        renderArchive
    );

    archiveList.appendChild(
        back
    );

    tasks.forEach(

        task=>{

            const item =
            document.createElement(
                "div"
            );

            item.className =
                "archive-item";

            item.innerHTML =

            `
            ${
            task.done
            ? "✓"
            : "○"
            }

            ${task.text}
            `;

            archiveList
            .appendChild(
                item
            );
        }
    );
}

// -------------------------
// Sidebar
// -------------------------

function openSidebar(){

    sidebar.classList.add(
        "open"
    );

    overlay.classList.add(
        "show"
    );
}

function closeSidebar(){

    sidebar.classList.remove(
        "open"
    );

    overlay.classList.remove(
        "show"
    );
}

menuBtn.addEventListener(

    "click",

    openSidebar
);

overlay.addEventListener(

    "click",

    closeSidebar
);

// -------------------------
// 页面切换
// -------------------------

document
.querySelectorAll(
    ".nav-btn"
)
.forEach(

btn=>{

    btn.addEventListener(

        "click",

        ()=>{

            const page =
                btn.dataset.page;

            document
            .querySelectorAll(
                ".nav-btn"
            )
            .forEach(

                b=>

                b.classList.remove(
                    "active"
                )
            );

            btn.classList.add(
                "active"
            );

            if(
                page ===
                "today"
            ){

                archivePage
                .classList.add(
                    "hidden"
                );

                todayPage
                .classList.remove(
                    "hidden"
                );
            }

            if(
                page ===
                "archive"
            ){

                todayPage
                .classList.add(
                    "hidden"
                );

                archivePage
                .classList.remove(
                    "hidden"
                );

                renderArchive();
            }

            closeSidebar();
        }
    );
});

backBtn.addEventListener(

    "click",

    ()=>{

        archivePage
        .classList.add(
            "hidden"
        );

        todayPage
        .classList.remove(
            "hidden"
        );
    }
);

// -------------------------
// Init
// -------------------------

loadState();

updateUserUI();

renderDate();

renderTodos();

renderArchive();

loadTodosFromCloud();