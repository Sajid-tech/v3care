import { useEffect, useRef, useState } from "react";
import Layout from "../../../layout/Layout";
import {
  Autocomplete,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  Person,
  PhoneIphone,
  Email,
  CurrencyRupee,
  PinDrop,
  Place,
  Assignment,
  MiscellaneousServices,
  WhatsApp,
} from "@mui/icons-material";
import styles from "./AddBooking.module.css";

import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import Fields from "../../../components/addBooking/TextField";
import { Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import BASE_URL from "../../../base/BaseUrl";
import { useNavigate } from "react-router-dom";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";

const baseURL = "https://agsdraft.online/app/public/api";

// const REACT_APP_GOOGLE_MAPS_KEY = "AIzaSyB9fQG7AbrrZaqICDY_4E5Prkabmhc-MRo";
const REACT_APP_GOOGLE_MAPS_KEY = "AIzaSyAk4WgZpl2DuYxnfgYLCXEQKvVLK3hJ7S0";
const whatsapp = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const AddBooking = () => {
  const autoCompleteRef = useRef(null);
  UseEscapeKey();
  const [query, setQuery] = useState("");
  const [query1, setQuery1] = useState("");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;

  const [currentYear, setCurrentYear] = useState("");

  const [booking, setBooking] = useState({
    order_date: todayback,
    order_year: currentYear,
    order_refer_by: "",
    order_customer: "",
    order_customer_mobile: "",
    order_customer_email: "",
    order_service_date: todayback,
    order_service: "",
    order_service_sub: "",
    order_service_price_for: "",
    order_service_price: "",
    order_custom: "",
    order_custom_price: "",
    order_discount: "",
    order_amount: "",

    order_flat: "",
    order_building: "",
    order_landmark: "",
    order_advance: "",
    order_km: "",
    order_time: "",
    order_remarks: "",
    order_comment: "",
    branch_id:
      localStorage.getItem("user_type_id") == "6"
        ? ""
        : localStorage.getItem("branch_id"),
    order_area: "",
    order_address: "",
    order_url: "",
    order_send_whatsapp: "",
  });

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {});

        setCurrentYear(response.data.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);

  const [serdata, setSerData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };
    fetch(baseURL + "/panel-fetch-service", requestOptions)
      .then((response) => response.json())
      .then((data) => setSerData(data.service));
  }, []);

  const [timeslot, setTimeSlot] = useState([]);
  useEffect(() => {
    fetch(baseURL + "/panel-fetch-timeslot-out")
      .then((response) => response.json())
      .then((data) => setTimeSlot(data.timeslot));
  }, []);

  const [serdatasub, setSerDataSub] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };
    fetch(
      baseURL + "/panel-fetch-service-sub/" + booking.order_service,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => setSerDataSub(data.servicesub));
  }, [booking.order_service]);

  const [pricedata, setPriceData] = useState([]);
  const HalfA = (selectedValue) => {
    localStorage.setItem("tempService", selectedValue.target.value);
    let data = {
      order_service: selectedValue.target.value,
      order_service_sub: booking.order_service_sub,
    };

    axios({
      url: baseURL + "/panel-fetch-service-price",
      method: "POST",
      data,

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPriceData(res.data.serviceprice);
    });
  };

  const HalfB = (selectedValue) => {
    let data = {
      order_service: localStorage.getItem("tempService"),
      order_service_sub: selectedValue.target.value,
    };
    axios({
      url: baseURL + "/panel-fetch-service-price",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setPriceData(res.data.serviceprice);
    });
  };

  const HalfC = (selectedValue) => {
    let data = {
      order_service_price_for: selectedValue.target.value,
    };
    axios({
      url: baseURL + "/panel-fetch-services-prices",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setBooking((booking) => ({
        ...booking,
        order_service_price: res.data.serviceprice.service_price_amount,
      }));
      setBooking((booking) => ({
        ...booking,
        order_amount: res.data.serviceprice.service_price_amount,
      }));
    });
  };

  const [branch, setBranch] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(baseURL + "/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => setBranch(data.branch));
  }, []);

  const [referby, setReferby] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(baseURL + "/panel-fetch-referby", requestOptions)
      .then((response) => response.json())
      .then((data) => setReferby(data.referby));
  }, []);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "order_customer_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "order_service_price") {
      if (validateOnlyDigits(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "order_custom_price") {
      if (validateOnlyDigits(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });

        setBooking((booking) => ({
          ...booking,
          order_amount: e.target.value,
        }));
      }
    } else if (e.target.name == "order_amount") {
      if (validateOnlyDigits(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "order_advance") {
      if (validateOnlyDigits(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "order_km") {
      if (validateOnlyNumber(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "order_pincode") {
      if (validateOnlyDigits(e.target.value)) {
        setBooking({
          ...booking,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setBooking({
        ...booking,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      {
        componentRestrictions: { country: "IN" },
      }
    );

    autoComplete.addListener("place_changed", () => {
      handlePlaceSelect(updateQuery);
    });
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = await autoComplete.getPlace();

    const query = addressObject.formatted_address;
    const url = addressObject.url;
    updateQuery(query);

    var addressComponents = addressObject.address_components;
    var city = addressComponents.find((component) =>
      component.types.includes("locality")
    );

    const latLng = {
      lat: addressObject?.geometry?.location?.lat(),
      lng: addressObject?.geometry?.location?.lng(),
    };

    setQuery1(url);
    setSelectedLocation(latLng);
  };

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("addIdniv");

    if (!form.checkValidity()) {
      toast.error("Fill all the filled");
      return;
    }
    let data = {
      order_date: booking.order_date,
      order_year: currentYear,
      order_refer_by: booking.order_refer_by,
      order_customer: booking.order_customer,
      order_customer_mobile: booking.order_customer_mobile,
      order_customer_email: booking.order_customer_email,
      order_service_date: booking.order_service_date,
      order_service: booking.order_service,
      order_service_sub: booking.order_service_sub,
      order_service_price_for: booking.order_service_price_for,
      order_service_price: booking.order_service_price,
      order_custom: booking.order_custom,
      order_custom_price: booking.order_custom_price,
      order_discount: booking.order_discount,
      order_amount: booking.order_amount,
      order_advance: booking.order_advance,
      order_flat: booking.order_flat,
      order_building: booking.order_building,
      order_landmark: booking.order_landmark,
      order_km: booking.order_km,
      order_time: booking.order_time,
      order_remarks: booking.order_remarks,
      order_comment: booking.order_comment,
      branch_id:
        localStorage.getItem("user_type_id") == "6"
          ? booking.branch_id
          : localStorage.getItem("branch_id"),
      order_area: booking.order_area,
      order_address: query,
      order_url: query1,
      order_send_whatsapp: booking.order_send_whatsapp,
    };

    var url = new URL(window.location.href);
    var id = url.searchParams.get("id");

    var v = document.getElementById("addIdniv").checkValidity();
    var v = document.getElementById("addIdniv").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/panel-create-booking",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          console.log("Data Inserted Sucessfully");
          toast.success(res.data?.msg || "Booking Create Successfully");
          navigate("/today");
        } else {
          console.log("Duplicate Entry");
          toast.error(res.data?.msg || "Duplicate Entry");
        }
      });
    }
  };

  return (
    <Layout>
      <PageHeader title={"Add Booking"} />

      <div className={styles["sub-container"]}>
        <form id="addIdniv" onSubmit={onSubmit}>
          <div className={styles["form-container"]}>
            <div>
              <div className="form-group">
                <Fields
                  title="Refer By"
                  type="dropdown"
                  name="order_refer_by"
                  autoComplete="Name"
                  value={booking.order_refer_by}
                  onChange={(e) => onInputChange(e)}
                  options={referby}
                />
              </div>
              <div className="form-group">
                <Fields
                  required="required"
                  title="Customer"
                  type="textField"
                  autoComplete="Name"
                  name="order_customer"
                  value={booking.order_customer}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                <Input
                  label="Mobile No"
                  required
                  maxLength={10}
                  types="tel"
                  title="Mobile No"
                  type="numberField"
                  autoComplete="Name"
                  name="order_customer_mobile"
                  value={booking.order_customer_mobile}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                <Fields
                  types="email"
                  title="Email"
                  type="textField"
                  autoComplete="Name"
                  name="order_customer_email"
                  value={booking.order_customer_email}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<Email sx={{ color: "red" }} />}
                />
              </div>
            </div>
            <div className={styles["second-div"]}>
              <div>
                <Input
                  fullWidth
                  label="Service Date"
                  required
                  id="order_service_date"
                  min={today}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="Name"
                  name="order_service_date"
                  value={booking.order_service_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                <Fields
                  title="Service"
                  type="serviceDropdown"
                  autoComplete="Name"
                  name="order_service"
                  value={booking.order_service}
                  onChange={(e) => {
                    onInputChange(e), HalfA(e);
                  }}
                  options={serdata}
                />
              </div>
              {booking.order_service == "23" ? (
                ""
              ) : serdatasub.length > 0 ? (
                <div>
                  <Fields
                    title="Service Sub"
                    type="subServiceDropdown"
                    autoComplete="Name"
                    name="order_service_sub"
                    value={booking.order_service_sub}
                    onChange={(e) => {
                      onInputChange(e), HalfB(e);
                    }}
                    options={serdatasub}
                  />
                </div>
              ) : (
                ""
              )}
              {booking.order_service == "23" ? (
                ""
              ) : (
                <div>
                  <Fields
                    required="required"
                    title="Price For"
                    type="priceforDropdown"
                    autoComplete="Name"
                    name="order_service_price_for"
                    value={booking.order_service_price_for}
                    onChange={(e) => {
                      onInputChange(e), HalfC(e);
                    }}
                    options={pricedata}
                  />
                </div>
              )}
            </div>
            <div className={styles["custom-service-dev"]}>
              {booking.order_service == "23" && (
                <>
                  <div>
                    <Fields
                      types="text"
                      title="Custom Service"
                      type="textField"
                      autoComplete="Name"
                      name="order_custom"
                      value={booking.order_custom}
                      onChange={(e) => onInputChange(e)}
                      startIcon={
                        <MiscellaneousServices sx={{ color: "red" }} />
                      }
                    />
                  </div>

                  <div>
                    <Fields
                      types="text"
                      title="Custom Price"
                      type="textField"
                      autoComplete="Name"
                      name="order_custom_price"
                      value={booking.order_custom_price}
                      onChange={(e) => onInputChange(e)}
                      startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                    />
                  </div>
                </>
              )}
            </div>
            <div className={styles["third-div"]}>
              <div>
                <Fields
                  required="required"
                  types="text"
                  title="Amount"
                  type="textField"
                  autoComplete="Name"
                  name="order_amount"
                  value={booking.order_amount}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                />
              </div>
              <div>
                <Fields
                  types="text"
                  title="Advance"
                  type="textField"
                  autoComplete="Name"
                  name="order_advance"
                  value={booking.order_advance}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<CurrencyRupee sx={{ color: "red" }} />}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Time Slot"
                  fullWidth
                  required
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="Name"
                  name="order_time"
                  value={booking.order_time}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                <Fields
                  types="number"
                  title="KM"
                  type="textField"
                  autoComplete="Name"
                  name="order_km"
                  value={booking.order_km}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<PinDrop sx={{ color: "orange" }} />}
                />
              </div>
              {localStorage.getItem("user_type_id") == "6" ? (
                <div>
                  <Fields
                    required="required"
                    title="Branch"
                    type="branchDropdown"
                    autoComplete="Name"
                    name="branch_id"
                    value={booking.branch_id}
                    onChange={(e) => onInputChange(e)}
                    options={branch}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="text-2xl p-2">
              <h1> Address</h1>
            </div>
            <hr />
            <div className={styles["address-div"]}>
              <div>
                <Typography variant="small" className={styles["heading"]}>
                  Search Place .. <span style={{ color: "red" }}> *</span>
                </Typography>
                <input
                  className={styles["search-div"]}
                  ref={autoCompleteRef}
                  id="order_address"
                  required
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Places ..."
                  value={query}
                />
              </div>
            </div>
            <div className={styles["address-first-div"]}>
              <div>
                <Fields
                  required="required"
                  types="text"
                  title="House #/Flat #/ Plot #"
                  type="textField"
                  autoComplete="Name"
                  name="order_flat"
                  value={booking.order_flat}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<HomeIcon sx={{ color: "green" }} />}
                />
              </div>
              <div>
                <Fields
                  required="required"
                  types="text"
                  title="Landmark"
                  type="textField"
                  autoComplete="Name"
                  name="order_landmark"
                  value={booking.order_landmark}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<Place sx={{ color: "green" }} />}
                />
              </div>
            </div>
            <div className={styles["address-second-div"]}>
              <div>
                <Fields
                  required="required"
                  title="Send Whatsapp to Customer"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  name="order_send_whatsapp"
                  value={booking.order_send_whatsapp}
                  onChange={(e) => onInputChange(e)}
                  options={whatsapp}
                />
              </div>
              <div>
                <Fields
                  types="text"
                  title="Remarks"
                  multiline="multiline"
                  type="textField"
                  autoComplete="Name"
                  name="order_remarks"
                  value={booking.order_remarks}
                  onChange={(e) => onInputChange(e)}
                  startIcon={<Place sx={{ color: "green" }} />}
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-2">
              <ButtonConfigColor
                type="submit"
                buttontype="submit"
                label="Submit"
              />

              <ButtonConfigColor
                type="back"
                buttontype="button"
                label="Cancel"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBooking;
