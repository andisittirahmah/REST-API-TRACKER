import express, { Request, Response } from "express";
import fs from "fs/promises";

const filePath = "./src/data/expense.json";

async function getTrackers() {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function getAllTrackers(req: Request, res: Response) {
  try {
    const trackers = await getTrackers();

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
  } catch (error) {
    console.error(error);
  }
}

export async function getDetails(req: Request, res: Response) {
  try {
    const trackers = await getTrackers();

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
  } catch (error) {
    console.error(error);
  }
}

export async function createTracker(req: Request, res: Response) {
  try {
    const { title, nominal, type, category } = req.body;

    const trackers = await getTrackers();
    const newTracker = {
      title,
      nominal,
      type,
      category,
      date: new Date(),
      id: trackers.length + 1,
    };
    trackers.push(newTracker);
    await fs.writeFile(filePath, JSON.stringify(trackers, null, 2));
    res.status(201).json({ message: "success adding new tarcker", newTracker });
  } catch (error) {
    console.error(error);
  }
}

export async function updateTracker(req: Request, res: Response) {
  try {
    let trackers = await getTrackers();
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

    trackers[findTrackerIndex] = { ...tracker, ...req.body };
    await fs.writeFile(filePath, JSON.stringify(trackers, null, 2));
    res.status(200).json({ message: "Update succcessfull", tracker });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTracker(req: Request, res: Response) {
  try {
    let trackers = await getTrackers();
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
    await fs.writeFile(filePath, JSON.stringify(trackers, null, 2));
    res.status(200).json({ message: "Delete succcessfull", tracker });
  } catch (error) {
    console.error(error);
  }
}

export async function expanseByCategory(req: Request, res: Response) {
  try {
    const trackers = await getTrackers();

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
  } catch (error) {
    console.error(error);
  }
}

export async function expanseByDate(req: Request, res: Response) {
  try {
    const trackers = await getTrackers();

    let total = 0;
    for (let i = 0; i < trackers.length; i++) {
      const currDate = new Date(trackers[i].date as any)
        .toISOString()
        .split("T");

      if (
        Date.parse(currDate[0]) >= Date.parse(req.query.start as any) &&
        Date.parse(currDate[0]) <= Date.parse(req.query.end as any)
      ) {
        total = total + trackers[i].nominal;
      }
    }

    if (total == 0) {
      res.status(404).json({ message: "Tracker date range not Found" });
    }

    res.status(200).json({ total });
  } catch (error) {
    console.error(error);
  }
}
