// =========================
// Today V1
// =========================

const STORAGE_KEY = "today-v1";

// -------------------------
// DOM
// -------------------------

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

// -------------------------
// 状态
// -------------------------

let state = {
    currentDate: "",
    today: [],
    archive: {}
};

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

    }else{

        state = {

            currentDate:
                getTodayString(),

            today: [],

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

    state.today.forEach(

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

                li.classList.toggle(
                    "done"
                );

                task.done =
                    newState;

                saveState();
            }
        );;

            // 删除

            li.querySelector(
                ".delete-btn"
            )

            .addEventListener(

                "click",

                ()=>{

                    state.today =
                    state.today.filter(

                        t=>

                        t.id !==
                        task.id
                    );

                    saveState();

                    renderTodos();
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

function addTask(){

    const text =
        taskInput.value.trim();

    if(!text){

        return;
    }

    state.today.push({

        id:
            Date.now(),

        text,

        done:false
    });

    taskInput.value = "";

    saveState();

    renderTodos();
}

addBtn.addEventListener(

    "click",

    addTask
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

renderDate();



renderArchive();