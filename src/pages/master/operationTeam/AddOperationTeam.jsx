import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

const AddOperationTeam = () => {
  const [team, setTeam] = useState({
    name: "",
    mobile: "",
    email: "",
    branch_id: "",
    user_aadhar_no: "",
    user_aadhar: "",
    user_pancard_no: "",
    user_pancard: "",
    user_type: "7",
    remarks: "",
  });
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);

  const [branch, setBranch] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => setBranch(data.branch));
  }, []);

  const onInputChange = (e) => {
    setTeam({
      ...team,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("name", team.name);
    data.append("mobile", team.mobile);
    data.append("email", team.email);
    data.append("remarks", team.remarks);
    data.append("branch_id", team.branch_id);
    data.append("user_type", team.user_type);
    data.append("user_aadhar_no", team.user_aadhar_no);
    data.append("user_aadhar", selectedFile1);
    data.append("user_pancard_no", team.user_pancard_no);
    data.append("user_pancard", selectedFile2);
    axios({
      url: BASE_URL + "/api/panel-create-admin-user",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success(" Create succesfull");

        setTeam({
          name: "",
          mobile: "",
          email: "",
          branch_id: "",
          user_aadhar_no: "",
          user_aadhar: "",
          user_pancard_no: "",
          user_pancard: "",
          user_type: "7",
          remarks: "",
        });
        navigate("/operation-team");
      } else {
        toast.error("duplicate entry");
      }
    });
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Operation Team
        </h3>
      </div>
      <div className="w-full p-4 mt-2 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
            {/* Full Name Field */}
            <div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={team.name}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-500 rounded-md  transition-all"
              />
            </div>

            {/* Mobile No Field */}
            <div>
              <Input
                label="Mobile No"
                type="text"
                name="mobile"
                value={team.mobile}
                onChange={onInputChange}
                maxLength={10}
                minLength={10}
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Email Id Field */}
            <div>
              <Input
                label="Email Id"
                type="email"
                required
                name="email"
                value={team.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Branch Select Field (conditional) */}
            {localStorage.getItem("user_type_id") === "6" && (
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Branch <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  name="branch_id"
                  value={team.branch_id}
                  onChange={onInputChange}
                  label="Branch *"
                  required
                >
                  {branch.map((branchdata) => (
                    <MenuItem key={branchdata.id} value={String(branchdata.id)}>
                      {branchdata.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Aadhar No Field */}
            <div>
              <Input
                label="Aadhar No"
                type="text"
                name="user_aadhar_no"
                value={team.user_aadhar_no}
                onChange={onInputChange}
                maxLength={12}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Aadhar Photo Upload */}
            <div>
              <Input
                label="Aadhar Photo"
                type="file"
                name="user_aadhar"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>

            {/* Pancard No Field */}
            <div>
              <Input
                label="Pancard No"
                type="text"
                name="user_pancard_no"
                value={team.user_pancard_no}
                onChange={onInputChange}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Pancard Photo Upload */}
            <div>
              <Input
                label="Pancard Photo"
                type="file"
                name="user_pancard"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Remarks Field */}
            <div className="col-span-2">
              <Textarea
                label="Remarks"
                name="remarks"
                value={team.remarks}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              ></Textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}

            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Submiting..." : "Submit"}</span>
              </div>
            </Button>

            {/* Back Button */}

            <Link to="/field-team">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-5 h-5" />
                  <span>Back</span>
                </div>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddOperationTeam;