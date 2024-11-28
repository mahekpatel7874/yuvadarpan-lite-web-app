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
import { useDispatch, useSelector } from "react-redux";
import { Form, FormikProvider, useFormik } from "formik";
import { endLoading, startLoading } from "../../../store/authSlice";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CustomAutoComplete from "../../../Component/Common/customAutoComplete";
import CustomInput from "../../../Component/Common/customInput";

export default function Index() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { country, state, region, district, city } = useSelector(
    (state) => state.location
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [list, setList] = useState({
    country: [],
    state: [],
    region: [],
    district: [],
    city: [],
  });
  const [selectedValue, setSelectedValue] = useState({
    country: null,
    state: null,
    region: null,
    district: null,
    city: null,
  });
  const [samajData, setSamajData] = useState(null);
  const [samajModalData, setSamajModalData] = useState(null);
  const [samajAddEditModel, setSamajAddEditModel] = useState(false);

  const getSamajList = async () => {
    axios
      .get(`/samaj/list?page=${page + 1}&limit=${rowsPerPage}`)
      .then((res) => {
        setSamajData(res.data);
      });
  };

  useEffect(() => {
    getSamajList();
  }, [page, rowsPerPage]);

  const samajColumn = [
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
          {console.log("city : ", city, record?.row?.city_id)}
          <Tooltip title={"Edit"}>
            <ModeEditIcon
              className={"text-primary cursor-pointer"}
              onClick={() => {
                setSamajModalData(record?.row);
                setSamajAddEditModel(!samajAddEditModel);
                setList((pre) => ({
                  ...pre,
                  country: country.map((data) => ({
                    ...data,
                    label: data.name,
                    value: data.id,
                  })),
                }));
                setSelectedValue((pre) => ({
                  ...pre,
                  country:
                    country.find((item) => item?.id === record?.row?.country_id)
                      ?.name ||
                    country.find(
                      (item) => item?.name === record?.row?.country_id
                    )?.name,
                  state: state.find(
                    (item) => item?.id === record?.row?.state_id
                  )?.name,
                  region: region.find(
                    (item) => item?.id === record?.row?.region_id
                  )?.name,
                  district: district.find(
                    (item) => item?.id === record?.row?.district_id
                  )?.name,
                  city: city.find((item) => item?.id === record?.row?.city_id)
                    ?.name,
                }));
                setFieldValue("name", record?.row.name);
                setFieldValue("label", record?.row.label);
                setFieldValue("zipcode", record?.row.zipcode);
                setFieldValue("country_id", record?.row.country_id);
                setFieldValue("state_id", record?.row.state_id);
                setFieldValue("region_id", record?.row.region_id);
                setFieldValue("district_id", record?.row.district_id);
                setFieldValue("city_id", record?.row.city_id);
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

  const getListById = (field, id) => {
    axios
      .get(`/${field}/list/${id}`)
      .then((res) => {
        const list = res.data.map((data) => ({
          ...data,
          label: data.name,
          value: data.id,
        }));
        switch (field) {
          case "state":
            setList((pre) => ({
              ...pre,
              state: list,
            }));
            break;
          case "region":
            setList((pre) => ({
              ...pre,
              region: list,
            }));
            break;
          case "district":
            setList((pre) => ({
              ...pre,
              district: list,
            }));
            break;
          case "city":
            setList((pre) => ({
              ...pre,
              city: list,
            }));
            break;
          default:
            return null;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const formik = useFormik({
    initialValues: {
      country_id: "",
      state_id: "",
      region_id: "",
      district_id: "",
      city_id: "",
      name: "",
      label: "",
      zipcode: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(startLoading());
        const { confirmPassword, ...rest } = values;
        samajModalData
          ? axios
              .patch(`/samaj/update/${samajModalData.id}`, {
                ...rest,
                updatedAt: new Date(),
              })
              .then((res) => {
                samajAddEditModalClose();
                getSamajList();
              })
          : axios
              .post(`/samaj/add`, {
                ...rest,
              })
              .then((res) => {
                samajAddEditModalClose();
                getSamajList();
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

  const samajAddEditModalClose = () => {
    setSamajAddEditModel(!samajAddEditModel);
    setSamajModalData(null);
    setFieldValue("name", null);
    setFieldValue("country_id", null);
    setFieldValue("state_id", null);
    setFieldValue("region_id", null);
    setFieldValue("district_id", null);
    setFieldValue("samaj_id", null);
    setSelectedValue({
      country: null,
      state: null,
      region: null,
      district: null,
      samaj: null,
    });
    resetForm();
  };

  const deleteAPI = async (id) => {
    axios
      .delete(`/samaj/delete`, {
        data: {
          samaj: [id],
        },
      })
      .then(() => {
        getSamajList();
      });
  };

  const hasError = Object.keys(errors)?.length || 0;

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <ContainerPage className={"flex-col justify-center flex items-start"}>
        <div className={"flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>Samaj</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={"bg-primary"}
            onClick={() => {
              setSamajAddEditModel(!samajAddEditModel);
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
            Add Samaj
          </Button>
        </div>
        <CustomTable
          columns={samajColumn}
          data={samajData}
          name={"users"}
          pageSize={rowsPerPage}
          setPageSize={setRowsPerPage}
          page={page}
          setPage={setPage}
          type={"userList"}
          className={"mx-0 w-full"}
        />
      </ContainerPage>
      {samajAddEditModel ? (
        <Modal
          open={samajAddEditModel}
          onClose={() => samajAddEditModalClose()}
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
              <span className={"text-2xl font-bold"}>City</span>
              <Tooltip title={"Edit"}>
                <CloseIcon
                  className={"cursor-pointer"}
                  onClick={() => samajAddEditModalClose()}
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
                          setFieldValue("country_id", country.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            country: country.name,
                            state: null,
                            region: null,
                            district: null,
                            city: null,
                          }));
                          getListById("state", country.id);
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
                            region: null,
                            district: null,
                            city: null,
                          }));
                          getListById("region", state.id);
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.country}
                      />
                      <CustomAutoComplete
                        list={list.region}
                        label={"Region"}
                        placeholder={"Select Your Region"}
                        name={"region_id"}
                        value={selectedValue.region}
                        errors={
                          touched?.region && errors?.region && errors?.region
                        }
                        onChange={(e, region) => {
                          setFieldValue("region_id", region.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            region: region.name,
                            district: null,
                            city: null,
                          }));
                          getListById("district", region.id);
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.state}
                      />
                      <CustomAutoComplete
                        list={list.district}
                        label={"District"}
                        placeholder={"Select Your District"}
                        name={"district_id"}
                        value={selectedValue.district}
                        errors={
                          touched?.district &&
                          errors?.district &&
                          errors?.district
                        }
                        onChange={(e, district) => {
                          setFieldValue("district_id", district.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            district: district.name,
                            city: null,
                          }));
                          getListById("city", district.id);
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.region}
                      />
                      <CustomAutoComplete
                        list={list.city}
                        label={"City"}
                        placeholder={"Select Your City"}
                        name={"city_id"}
                        value={selectedValue.city}
                        errors={touched?.city && errors?.city && errors?.city}
                        onChange={(e, city) => {
                          setFieldValue("city_id", city.id);
                          setSelectedValue((pre) => ({
                            ...pre,
                            city: city.name,
                          }));
                        }}
                        onBlur={handleBlur}
                        disabled={!selectedValue.district}
                      />
                      <CustomInput
                        name={"name"}
                        id="samaj"
                        label="Samaj"
                        value={values.name}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.city}
                        onBlur={handleBlur}
                        errors={touched?.name && errors?.name && errors?.name}
                      />
                      <CustomInput
                        name={"label"}
                        id="samajLabel"
                        label="Samaj Label"
                        value={values.label}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.city}
                        onBlur={handleBlur}
                        errors={
                          touched?.label && errors?.label && errors?.label
                        }
                      />
                      <CustomInput
                        name={"zipcode"}
                        id="samajZipcode"
                        label="Zipcode"
                        value={values.zipcode}
                        variant="outlined"
                        onChange={handleChange}
                        disabled={!selectedValue.city}
                        onBlur={handleBlur}
                        errors={
                          touched?.zipcode && errors?.zipcode && errors?.zipcode
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
                        {samajModalData ? "UPDATE" : "ADD"}
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
