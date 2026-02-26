<!--  FE-11  -->

<div align="center">

```
███████╗███████╗     ██╗ ██╗
██╔════╝██╔════╝    ███║███║
█████╗  █████╗  █████╗██║╚██║
██╔══╝  ██╔══╝  ╚════╝██║ ██║
██║     ███████╗      ██║ ██║
╚═╝     ╚══════╝      ╚═╝ ╚═╝
```

# 🚢 Container Module

**Phase** `FE-11` &nbsp;·&nbsp; **Priority** `🟡 MEDIUM` &nbsp;·&nbsp; **Status** `⬜ TODO`

---

*Backend:* `http://localhost:3001` &nbsp;|&nbsp; *Depends On:* [`FE-02`](./FE-02_Auth_Integration_App_Shell.md) &nbsp;|&nbsp; *Enables:* `FE-12`

</div>

---

## ◈ Overview

Shipping container management — track containers from loading through arrival, with booking numbers, ETD/ETA dates, weight info, status timeline, and attached shipping documents.

---

## ◈ API Endpoints

| Method | Endpoint | Used In | Auth? |
|:------:|----------|---------|:-----:|
| `POST` | `/api/v1/container` | Create form | 🔒 Bearer |
| `GET` | `/api/v1/containers` | List page | 🔒 Bearer |
| `PUT` | `/api/v1/container/:cId` | Edit form | 🔒 Bearer |
| `DELETE` | `/api/v1/container/:cId` | Table action | 🔒 Bearer |
| `GET` | `/api/v1/container/booking-numbers` | Filter/Autocomplete | 🔒 Bearer |

---

## ◈ Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/pages/containers/ContainerList.tsx` | Page | Container list + status filter |
| `src/pages/containers/ContainerDetail.tsx` | Page | Full details + documents list |
| `src/components/containers/ContainerForm.tsx` | UI | Create/Edit with date pickers |
| `src/components/containers/ContainerTable.tsx` | UI | Table with ETD, ETA, status |
| `src/components/containers/ContainerStatusBadge.tsx` | UI | Colored badge per status |
| `src/components/containers/ContainerTimeline.tsx` | UI | Visual loading→shipped→arrived |
| `src/components/containers/DocumentList.tsx` | UI | Attached docs with download |
| `src/api/containers.api.ts` | API | All container HTTP calls |
| `src/store/containers/containers.slice.ts` | Slice | Container list + documents |
| `src/store/containers/containers.thunk.ts` | Thunk | CRUD + document thunks |
| `src/store/containers/containers.types.ts` | Types | `IContainer`, `IContainerDocument` |

---

## ◈ Container Form Fields

| Field | Type | Notes |
|-------|------|-------|
| Booking Number | Text | Required, unique |
| Container Count | Number | How many containers |
| Avg Weight (kg) | Number | Average weight per container |
| Loading Date | Date Picker | When loading starts |
| ETD Date | Date Picker | Expected departure |
| ETA Date | Date Picker | Expected arrival |
| Status | Select | `loading` \| `shipped` \| `arrived` \| `delayed` |

---

## ◈ Status Timeline Visual

```
[ Loading ] ──►──── [ Shipped ] ──►──── [ Arrived ]
    ●                    ○                    ○
  Current               Next               Complete

Color: filled = current/done, empty = upcoming
```

---

## ◈ Acceptance Criteria

- [ ] Container list shows booking number, count, ETD/ETA, status badge
- [ ] Status timeline displayed visually on detail page
- [ ] Booking number autocomplete from `GET /booking-numbers`
- [ ] Documents attached to containers are listed with name, type, size, and download
- [ ] ETD/ETA dates highlighted in red if overdue (past date + not arrived)
- [ ] Module hidden when `isContainerEnabled === false`

---

<div align="center">

[`FE-10`](./FE-10_Ring_Customer_Module.md) &nbsp;→&nbsp; `FE-11` &nbsp;→&nbsp; [`FE-12`](./FE-12_Polish_Dark_Mode_Release.md)

*Management System · Frontend Phase Plans*

</div>