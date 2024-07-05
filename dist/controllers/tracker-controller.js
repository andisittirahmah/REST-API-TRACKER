var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs/promises";
const filePath = "./src/data/expense.json";
function getTrackers() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    });
}
export function getAllTrackers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackers = yield getTrackers();
            const newTrackers = [];
            for (let i = 0; i < trackers.length; i++) {
                const tracker = {
                    id: trackers[i].id,
                    title: trackers[i].title,
                    nominal: trackers[i].nominal,
                };
                newTrackers.push(tracker);
            }
            res
                .status(200)
                .json({ message: " success getting all of the to do list", newTrackers });
        }
        catch (error) {
            console.error(error);
        }
    });
}
export function getDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackers = yield getTrackers();
            const newTracker = {
                id: -1,
                title: "",
                nominal: "",
                category: "",
                date: "",
            };
            for (let i = 0; i < trackers.length; i++) {
                if (trackers[i].id == req.params.id) {
                    newTracker.id = trackers[i].id;
                    newTracker.title = trackers[i].title;
                    newTracker.nominal = trackers[i].nominal;
                    newTracker.category = trackers[i].category;
                    newTracker.date = trackers[i].date;
                }
            }
            if (newTracker.id == -1) {
                res.status(404).json({ message: "Tracker not Found" });
            }
            res.status(200).json({ newTracker });
        }
        catch (error) {
            console.error(error);
        }
    });
}
export function createTracker(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, nominal, type, category } = req.body;
            const trackers = yield getTrackers();
            const newTracker = {
                title,
                nominal,
                type,
                category,
                date: new Date(),
                id: trackers.length + 1,
            };
            trackers.push(newTracker);
            yield fs.writeFile(filePath, JSON.stringify(trackers, null, 2));
            res.status(201).json({ message: "success adding new tarcker", newTracker });
        }
        catch (error) {
            console.error(error);
        }
    });
}
export function updateTracker(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trackers = yield getTrackers();
            let findTrackerIndex = -1;
            for (let i = 0; i < trackers.length; i++) {
                if (trackers[i].id == req.params.id) {
                    findTrackerIndex = i;
                }
            }
            const tracker = trackers[findTrackerIndex];
            if (!tracker) {
                res.status(404).json({ message: "tracker not found" });
            }
            trackers[findTrackerIndex] = Object.assign(Object.assign({}, tracker), req.body);
            yield fs.writeFile(filePath, JSON.stringify(trackers, null, 2));
            res.status(200).json({ message: "Update succcessfull", tracker });
        }
        catch (error) {
            console.error(error);
        }
    });
}
export function deleteTracker(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let trackers = yield getTrackers();
            let findTrackerIndex = -1;
            for (let i = 0; i < trackers.length; i++) {
                if (trackers[i].id == req.params.id) {
                    findTrackerIndex = i;
                }
            }
            const tracker = trackers[findTrackerIndex];
            if (!tracker) {
                res.status(404).json({ message: "tracker not found" });
            }
            trackers.splice(findTrackerIndex, 1);
            yield fs.writeFile(filePath, JSON.stringify(trackers, null, 2));
            res.status(200).json({ message: "Delete succcessfull", tracker });
        }
        catch (error) {
            console.error(error);
        }
    });
}
export function expanseByCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackers = yield getTrackers();
            let total = 0;
            for (let i = 0; i < trackers.length; i++) {
                if (trackers[i].category == req.query.category) {
                    total = total + trackers[i].nominal;
                }
            }
            if (total == 0) {
                res.status(404).json({ message: "Tracker category not Found" });
            }
            res.status(200).json({ total });
        }
        catch (error) {
            console.error(error);
        }
    });
}
export function expanseByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trackers = yield getTrackers();
            let total = 0;
            for (let i = 0; i < trackers.length; i++) {
                const currDate = new Date(trackers[i].date)
                    .toISOString()
                    .split("T");
                if (Date.parse(currDate[0]) >= Date.parse(req.query.start) &&
                    Date.parse(currDate[0]) <= Date.parse(req.query.end)) {
                    total = total + trackers[i].nominal;
                }
            }
            if (total == 0) {
                res.status(404).json({ message: "Tracker date range not Found" });
            }
            res.status(200).json({ total });
        }
        catch (error) {
            console.error(error);
        }
    });
}
