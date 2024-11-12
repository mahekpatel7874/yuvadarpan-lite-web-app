import React, { useEffect, useState } from "react";
import Header from "../../../Component/Header";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import CustomTable from "../../../Component/Common/customTable";
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../util/useAxios";
import ContainerPage from "../../../Component/Container";
import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import CustomInput from "../../../Component/Common/customInput";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";

export default function Index() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { country } = useSelector((state) => state.location);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [stateModalData, setStateModalData] = useState(null);
  const [stateAddEditModel, setStateAddEditModel] = useState(false);

  const getStateList = async () => {
    axios
      .get(`/state/list?page=${page + 1}&limit=${rowsPerPage}`)
      .then((res) => {
        setStateData(res.data);
      });
  };

  useEffect(() => {
    getStateList();
  }, [page, rowsPerPage]);

  const stateListColumn = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
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
          <CustomSwitch checked={record?.row?.active} />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "outline-none",
      sortable: false,
      renderCell: (record) => (
        <div className={"flex gap-3 justify-between items-center"}>
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => {
                setStateModalData(record?.row);
                setStateAddEditModel(!stateAddEditModel);
                setCountryList(
                  country.map((data) => ({
                    ...data,
                    label: data.name,
                    value: data.id,
                  }))
                );
                setFieldValue("name", record?.row.name);
                setFieldValue("country_id", record?.row.country_id);
                setSelectedCountry(
                  country.find((item) => item?.id === record?.row?.country_id)
                    ?.name
                );
              }}
            />
          </Tooltip>
          <Tooltip title={"Delete"}>
            <DeleteIcon
              className={"text-primary cursor-pointer"}
              onClick={() => deleteAPI(record?.row?.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const formik = useFormik({
    initialValues: {
      country_id: "",
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        stateModalData
          ? axios
              .patch(
                `${process.env.REACT_APP_BASE_URL}/state/update/${stateModalData.id}`,
                {
                  ...rest,
                  updatedAt: new Date(),
                }
              )
              .then((res) => {
                stateAddEditModalClose();
                getStateList();
              })
          : axios
              .post(`${process.env.REACT_APP_BASE_URL}/state/add`, {
                ...rest,
              })
              .then((res) => {
                stateAddEditModalClose();
                getStateList();
              });
      } catch (e) {
        console.log("Error =>", e);
      } finally {
        dispatch(endLoading());
      }
      resetForm();
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
    }),
  });
  const {
    errors,
    values,
    setValues,
    resetForm,
    handleChange,
    handleBlur,
    touched,
    setFieldValue,
  } = formik;

  const stateAddEditModalClose = () => {
    setStateAddEditModel(!stateAddEditModel);
    setStateModalData(null);
    setFieldValue("name", null);
    resetForm();
  };

  const deleteAPI = async (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/state/delete`, {
        data: {
          states: [id],
        },
      })
      .then(() => {
        getStateList();
      });
  };

  const hasError = Object.keys(errors)?.length || 0;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className={"flex-col justify-center flex items-start"}>
        <div className={"flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>State</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => {
              setStateAddEditModel(!stateAddEditModel);
              setCountryList(
                country.map((data) => ({
                  ...data,
                  label: data.name,
                  value: data.id,
                }))
              );
            }}
          >
            Add State
          </Button>
        </div>
        <CustomTable
          columns={stateListColumn}
          data={stateData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </ContainerPage>
      {stateAddEditModel ? (
        <Modal
          open={stateAddEditModel}
          onClose={() => stateAddEditModalClose()}
          sx={{
            "& .MuiModal-backdrop": {
              backdropFilter: "blur(2px) !important",
              background: "#878b9499 !important",
            },
          }}
          className="flex justify-center items-center"
        >
          <Paper
            elevation={10}
            className="!rounded-2xl p-4 w-3/4 max-w-[600px] outline-none"
          >
            <div className={"flex flex-row justify-between"}>
              <span className={"text-2xl font-bold"}>State</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => stateAddEditModalClose()}
                />
              </Tooltip>
            </div>
            <FormikProvider value={formik}>
              <Form
                className={
                  "gap-4 flex flex-col w-full h-full max-h-[90%] overflow-auto"
                }
              >
                <Grid container className={"w-full pt-4"} spacing={2}>
                  <Grid item xs={12}>
                    <FormControl className={"w-full flex  gap-4"}>
                      <CustomAutoComplete
                        list={countryList}
                        label={"Country"}
                        placeholder={"Select Your Country"}
                        name={"country_id"}
                        value={selectedCountry}
                        errors={
                          touched?.country && errors?.country && errors?.country
                        }
                        onSelect={handleChange}
                        onChange={(e, country) => {
                          setFieldValue("country_id", country.id);
                          setSelectedCountry(country.name);
                        }}
                        onBlur={handleBlur}
                      />
                      <CustomInput
                        name={"name"}
                        id="state"
                        label="State"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedCountry}
                        onBlur={handleBlur}
                        errors={touched?.name && errors?.name && errors?.name}
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
                        {stateModalData ? "UPDATE" : "ADD"}
                      </button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Paper>
        </Modal>
      ) : null}
    </Box>
  );
}
