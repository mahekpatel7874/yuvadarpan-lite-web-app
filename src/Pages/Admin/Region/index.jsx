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
import CustomSwitch from "../../../Component/Common/CustomSwitch";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTable from "../../../Component/Common/customTable";
import axios from "../../../util/useAxios";
import ContainerPage from "../../../Component/Container";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";
import { useDispatch, useSelector } from "react-redux";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";

export default function Index() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { country, state } = useSelector((state) => state.location);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = useState({ country: [], state: [] });
  const [selectedValue, setSelectedValue] = useState({
    country: null,
    state: null,
  });
  const [regionData, setRegionData] = useState(null);
  const [regionModalData, setRegionModalData] = useState(null);
  const [regionAddEditModel, setRegionAddEditModel] = useState(false);

  const getRegionList = async () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/region/list?page=${
          page + 1
        }&limit=${rowsPerPage}`
      )
      .then((res) => {
        setRegionData(res.data);
      });
  };

  useEffect(() => {
    getRegionList();
  }, [page, rowsPerPage]);

  const regionListColumn = [
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
                setRegionModalData(record?.row);
                setRegionAddEditModel(!regionAddEditModel);
                setList((pre) => ({
                  ...pre,
                  country: country.map((data) => ({
                    ...data,
                    label: data.name,
                    value: data.id,
                  })),
                }));
                setFieldValue("country_id", record?.row.country_id);
                setFieldValue("state_id", record?.row.state_id);
                setFieldValue("name", record?.row.name);
                setSelectedValue((pre) => ({
                  ...pre,
                  country: country.find(
                    (item) => item?.id === record?.row?.country_id
                  )?.name,
                  state: state.find(
                    (item) => item?.id === record?.row?.state_id
                  )?.name,
                }));
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

  console.log("set : ", selectedValue);

  const getListById = (id) => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/state/list/${id}`)
      .then((res) => {
        const list = res.data.map((data) => ({
          ...data,
          label: data.name,
          value: data.id,
        }));
        setList((pre) => ({
          ...pre,
          state: list,
        }));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const formik = useFormik({
    initialValues: {
      country_id: "",
      state_id: "",
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      console.log("set 111: ", values);
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        regionModalData
          ? axios
              .patch(
                `${process.env.REACT_APP_BASE_URL}/region/update/${regionModalData.id}`,
                {
                  ...rest,
                  updatedAt: new Date(),
                }
              )
              .then((res) => {
                regionAddEditModalClose();
                getRegionList();
              })
          : axios
              .post(`${process.env.REACT_APP_BASE_URL}/region/add`, {
                ...rest,
              })
              .then((res) => {
                regionAddEditModalClose();
                getRegionList();
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

  const regionAddEditModalClose = () => {
    setRegionAddEditModel(!regionAddEditModel);
    setRegionModalData(null);
    setFieldValue("name", null);
    setFieldValue("country_id", null);
    setFieldValue("state_id", null);
    setSelectedValue({
      country: null,
      state: null,
    });
    resetForm();
  };

  const deleteAPI = async (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/region/delete`, {
        data: {
          regions: [id],
        },
      })
      .then(() => {
        getRegionList();
      });
  };

  const hasError = Object.keys(errors)?.length || 0;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className={"flex-col justify-center flex items-start"}>
        <div className={"flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>Region</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => {
              setRegionAddEditModel(!regionAddEditModel);
              setList((pre) => ({
                ...pre,
                country: country.map((data) => ({
                  ...data,
                  label: data.name,
                  value: data.id,
                })),
              }));
            }}
          >
            Add Region
          </Button>
        </div>
        <CustomTable
          columns={regionListColumn}
          data={regionData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </ContainerPage>
      {regionAddEditModel ? (
        <Modal
          open={regionAddEditModel}
          onClose={() => regionAddEditModalClose()}
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
              <span className={"text-2xl font-bold"}>Region</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => regionAddEditModalClose()}
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
                        list={list.country}
                        label={"Country"}
                        placeholder={"Select Your Country"}
                        name={"country_id"}
                        value={selectedValue.country}
                        errors={
                          touched?.country && errors?.country && errors?.country
                        }
                        onSelect={handleChange}
                        onChange={(e, country) => {
                          setSelectedValue((pre) => ({
                            ...pre,
                            country: country.name,
                            state: null,
                          }));
                          setFieldValue("country_id", country.id);
                          getListById(country.id);
                        }}
                        onBlur={handleBlur}
                      />
                      <CustomAutoComplete
                        list={list.state}
                        label={"State"}
                        placeholder={"Select Your State"}
                        name={"state_id"}
                        value={selectedValue.state}
                        errors={
                          touched?.state && errors?.state && errors?.state
                        }
                        onChange={(e, state) => {
                          setFieldValue("state_id", state.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            state: state.name,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.country}
                      />
                      <CustomInput
                        name={"name"}
                        id="region"
                        label="Region"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.state}
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
                        {regionModalData ? "UPDATE" : "ADD"}
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
