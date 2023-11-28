import React from "react";
import CustomTable from "../Common/customTable";
import { Box, Button, Grid, Modal, Paper, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomTextFieldInfo from "../Common/customTextFieldInfo";
import useUserList from "./useUserList";
import Header from "../Common/header";

const userList = [
  {
    id: 1,
    firstName: "Jon",
    middleName: "Wed",
    lastName: "Snow",
    email: "jon@123",
  },
  {
    id: 2,
    firstName: "Cersei",
    middleName: "Aed",
    lastName: "Lannister",
    email: "Cersei@123",
  },
  {
    id: 3,
    firstName: "Jaime",
    middleName: "Bed",
    lastName: "Lannister",
    email: "Jaime@123",
  },
  {
    id: 4,
    firstName: "Arya",
    middleName: "Fed",
    lastName: "Stark",
    email: "Arya@123",
  },
  {
    id: 5,
    firstName: "Daenerys",
    middleName: "Ged",
    lastName: "Targaryen",
    email: "Daenerys@123",
  },
  {
    id: 6,
    firstName: null,
    middleName: "Hed",
    lastName: "Melisandre",
    email: "Melisandre@123",
  },
  {
    id: 7,
    firstName: "Ferrara",
    middleName: "Jed",
    lastName: "Clifford",
    email: "Ferrara@123",
  },
  {
    id: 8,
    firstName: "Rossini",
    middleName: "Ked",
    lastName: "Frances",
    email: "Rossini@123",
  },
  {
    id: 9,
    firstName: "Harvey",
    middleName: "Led",
    lastName: "Roxie",
    email: "Harvey@123",
  },
  {
    id: 10,
    firstName: "Jon",
    middleName: "Wed",
    lastName: "Snow",
    email: "jon@123",
  },
  {
    id: 11,
    firstName: "Cersei",
    middleName: "Aed",
    lastName: "Lannister",
    email: "Cersei@123",
  },
  {
    id: 12,
    firstName: "Jaime",
    middleName: "Bed",
    lastName: "Lannister",
    email: "Jaime@123",
  },
  {
    id: 13,
    firstName: "Arya",
    middleName: "Fed",
    lastName: "Stark",
    email: "Arya@123",
  },
  {
    id: 14,
    firstName: "Daenerys",
    middleName: "Ged",
    lastName: "Targaryen",
    email: "Daenerys@123",
  },
  {
    id: 15,
    firstName: null,
    middleName: "Hed",
    lastName: "Melisandre",
    email: "Melisandre@123",
  },
  {
    id: 16,
    firstName: "Ferrara",
    middleName: "Jed",
    lastName: "Clifford",
    email: "Ferrara@123",
  },
  {
    id: 17,
    firstName: "Rossini",
    middleName: "Ked",
    lastName: "Frances",
    email: "Rossini@123",
  },
  {
    id: 18,
    firstName: "Harvey",
    middleName: "Led",
    lastName: "Roxie",
    email: "Harvey@123",
  },
];

function UserList() {
  const usersTableHeader = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "middleName",
      headerName: "Middle name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white place-content-center",
      cellClassName: "items-center flex px-8",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <Tooltip title={"Details"}>
            <Button
              variant="text"
              className={""}
              onClick={() => userInfoModalOpen(record.row)}
            >
              <VisibilityIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const {
    userInfoModel,
    userData,
    action: { userInfoModalOpen, userInfoModalClose },
  } = useUserList();

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <CustomTable
        columns={usersTableHeader}
        data={userList}
        name={"users"}
        pageSize={10}
        type={"userList"}
      />
      <Modal
        open={userInfoModel}
        onClose={userInfoModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          "& .MuiModal-backdrop": {
            backdropFilter: " blur(2px) !important",
            background: "#878b9499 !important",
          },
        }}
        className="flex justify-center items-center"
      >
        <Paper elevation={10} className="!rounded-2xl p-4 w-1/2">
          <Grid container spacing={2} className="p-4">
            <CustomTextFieldInfo
              grid={4}
              label={"First Name"}
              value={userData?.firstName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Middle Name"}
              value={userData?.middleName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Last Name"}
              value={userData?.lastName}
            />
            <CustomTextFieldInfo
              grid={12}
              label={"E-mail"}
              value={userData?.email}
            />
          </Grid>
        </Paper>
      </Modal>
    </Box>
  );
}

export default UserList;
