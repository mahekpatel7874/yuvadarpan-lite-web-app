import React, { useEffect, useState } from "react";
import CustomTable from "../../../Component/Common/customTable";
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Header from "../../../Component/Header";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Form, FormikProvider, useFormik } from "formik";
import axios from "../../../util/useAxios";
import * as Yup from "yup";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import CustomInput from "../../../Component/Common/customInput";
import { useDispatch, useSelector } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";

function Index() {
  const { notification, setNotification } = NotificationData();
  const [userInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      familyId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      active: false,
      allowed: false,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        axios
          .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${rest._id}`, {
            ...rest,
          })
          .then((res) => {
            userInfoModalClose();
            handleUserList();
          });
      } catch (e) {
        console.log("Error =>", e);
      } finally {
        dispatch(endLoading());
      }
      resetForm();
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      familyId: Yup.number()
        .typeError("Must be a number")
        .positive()
        .required("Required"),
      mobile: Yup.number().typeError("Must be a number").required("Required"),
      email: Yup.string().email().required("Required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .test({
          message: "Password not match",
          test: function (value) {
            return value === values.password;
          },
        }),
    }),
  });

  useEffect(() => {
    handleUserList();
  }, []);

  const {
    errors,
    values,
    setValues,
    resetForm,
    handleChange,
    handleBlur,
    touched,
  } = formik;

  const userInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setValues({ ...userInfo, password: "" });
  };

  const userActionHandler = (userInfo, action, field) => {
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${userInfo?._id}`, {
        ...userInfo,
        [field]: action,
      })
      .then((res) => {
        handleUserList();
      });
  };

  const userInfoModalClose = () => {
    setRequestInfoModel(false);
    resetForm();
  };
  const handleUserList = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/list?page=1&limit=10`)
      .then((res) => {
        setUserList(
          res.data?.data?.map((data) => ({ ...data, id: data?._id }))
        );
      });
  };

  const usersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "middleName",
      headerName: "Middle name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "allowed",
      headerName: "Allowed",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <CustomSwitch
            checked={record?.row?.allowed}
            onClick={(e) =>
              userActionHandler(record?.row, !record?.row?.allowed, "allowed")
            }
          />
        </div>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center justify-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <CustomSwitch
            checked={record?.row?.active}
            onClick={(e) =>
              userActionHandler(record?.row, !record?.row?.active, "active")
            }
          />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName:
        "items-center justify-center flex px-8 outline-none cursor-pointer",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <ModeEditIcon
            className={"text-primary"}
            onClick={() => userInfoModalOpen(record?.row)}
          />
        </div>
      ),
    },
  ];

  const hasError = Object.keys(errors)?.length || 0;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto"
        }
      >
        <div className={"p-4 pb-0 justify-between flex items-center"}>
          <p className={"text-3xl font-bold"}>Users</p>
        </div>
        <CustomTable
          columns={usersTableHeader}
          data={userList}
          name={"users"}
          pageSize={10}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </div>
      {userInfoModel ? (
        <Modal
          open={userInfoModel}
          // onClose={userInfoModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            "& .MuiModal-backdrop": {
              backdropFilter: " blur(2px) !important",
              background: "#878b9499 !important",
            },
          }}
          className="flex justify-center items-center m-4"
        >
          <Paper
            elevation={10}
            className="!rounded-2xl p-4 w-full max-w-[600px]"
          >
            <div className={"flex justify-between items-center"}>
              <Typography className={"font-bold text-2xl"}>
                Update User
              </Typography>
              <HighlightOffIcon
                onClick={userInfoModalClose}
                className={"cursor-pointer"}
              />
            </div>
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
                }
              >
                <Grid container className={"w-full pt-4"} spacing={2}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"familyId"}
                        id="familyId"
                        label="Family ID"
                        value={values?.familyId}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.familyId &&
                          errors?.familyId &&
                          errors?.familyId
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"firstName"}
                        id="firstName"
                        label="First Name"
                        value={values?.firstName}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.firstName &&
                          errors?.firstName &&
                          errors?.firstName
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"middleName"}
                        id="middleName"
                        label="Middle Name"
                        value={values?.middleName}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.middleName &&
                          errors?.middleName &&
                          errors?.middleName
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"lastName"}
                        id="lastName"
                        label="Last Name"
                        value={values?.lastName}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.lastName &&
                          errors?.lastName &&
                          errors?.lastName
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"email"}
                        id="email"
                        label="Email"
                        value={values?.email}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.email && errors?.email && errors?.email
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"mobile"}
                        id="mobile"
                        label="Mobile"
                        value={values?.mobile}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.mobile && errors?.mobile && errors?.mobile
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"password"}
                        id="password"
                        label="Password"
                        value={values?.password}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.password &&
                          errors?.password &&
                          errors?.password
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl className={"w-full"}>
                      <CustomInput
                        name={"confirmPassword"}
                        id="confirmPassword"
                        label="Confirm Password"
                        value={values?.confirmPassword}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={
                          touched?.confirmPassword &&
                          errors?.confirmPassword &&
                          errors?.confirmPassword
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className={"flex justify-center items-center"}
                  >
                    {loading ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      <button
                        className={`bg-[#572a2a] text-white w-full p-3 normal-case text-base rounded-lg font-bold transition-all ${
                          hasError ? "opacity-50" : "opacity-100"
                        }`}
                        type={"submit"}
                        disabled={hasError}
                      >
                        Update
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Paper>
        </Modal>
      ) : null}
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}

export default Index;
