import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "axios";
import {BASE_URL} from "../../../base/BaseUrl";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";

const VendorDownload = () => {
  const [downloadVendor, setDownloadVendor] = useState({ vendor_status: "" });
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setDownloadVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    setIsLoading(true);
    try {
      const data = {
        vendor_status: downloadVendor.vendor_status,
      };
      const token = localStorage.getItem("token");
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Success notification could be added here
      console.log(`${fileName} downloaded successfully.`);
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      // Error notification could be added here
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/panel-download-vendor`,
      `vendor-list-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <Layout>
      <PageHeader title={"Download Vendor Report"} />

      <div className="bg-white shadow-md rounded-lg  mt-2 overflow-hidden">
        <form onSubmit={onSubmit} className="p-6">
          <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
            <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
            <p>
              Select a vendor status to filter your report. Leave status blank
              to include all vendors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <TextField
              label="Vendor Status"
              select
              size="small"
              name="vendor_status"
              value={downloadVendor.vendor_status}
              onChange={onInputChange}
              variant="outlined"
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <div >
              <ButtonConfigColor
                type="download"
                label="Download Report"
                loading={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default VendorDownload;
