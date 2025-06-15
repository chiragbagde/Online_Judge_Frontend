import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getConfig } from "../utils/getConfig";
import { useDispatch, useSelector } from "react-redux";
import { urlConstants } from "../apis";
import { setAvatar } from "../features/auth/dataSlice";


export function useProfilePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef(null);
  const [socialLinks, setSocialLinks] = useState({});
  const [user, setUser] = useState({});
  const { user: userPr } = useSelector((state) => state.auth);
  const { avatar } = useSelector(state => state.data);
  const dispatch = useDispatch();

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("u_id", userPr?.id);
      try {
        await axios.post(urlConstants.updateSocialImage, formData, getConfig());
        toast.success("Avatar updated successfully!");
        dispatch(setAvatar(URL.createObjectURL(file)));
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const handleFieldSave = async (field, value) => {
    try {
      const payload = {
        id: socialLinks._id,
        u_id: userPr?.id,
      };
      if (["name", "firstname"].includes(field)) payload.firstname = value;
      else if (field === "lastname") payload.lastname = value;
      else if (field === "email") payload.email = value;
      else payload[field] = value;
      await axios.post(urlConstants.updateSocialProfile, payload, getConfig());
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`);
      if (["website", "github", "linkedin", "twitter", "instagram", "facebook"].includes(field)) {
        setSocialLinks((prev) => ({ ...prev, [field]: value }));
      } else {
        setUser((prev) => ({ ...prev, [field]: value }));
      }
    } catch (error) {
      toast.error("Failed to update profile field.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const res = await axios.post(
          urlConstants.getSocialProfile,
          { u_id: userPr?.id },
          getConfig()
        );
        setUser({
          firstname: res.data.socialProfile.firstname || '',
          lastname: res.data.socialProfile.lastname || '',
          username: res.data.socialProfile.username || '',
          summary: res.data.socialProfile.summary || '',
          email: res.data.socialProfile.email || '',
          mobile: res.data.socialProfile.mobile || ''
        });
        setSocialLinks(res.data.socialProfile || {});
      } catch (error) {
        console.error("Error fetching social data:", error);
      }
    };
    if (userPr?.id) fetchSocialData();
  }, [userPr?.id]);

  const fetchProfileImage = async (u_id) => {
    try {
      const res = await axios.get(`${urlConstants.getSocialImage}/${u_id}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return URL.createObjectURL(res.data);
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return  ""      ;
    }
  };

  const deleteProfileImage = async (u_id) => {
    try {
      const res = await axios.delete(`${urlConstants.deleteSocialImage}/${u_id}`, getConfig());
      toast.success("File deleted successflly!")
      dispatch(setAvatar(null));
    }catch(e){
      console.error(e);
      toast.error("Unable to delete the file.")
    }
  }

  useEffect(() => {
    const getAvatar = async () => {
      try {
        if (userPr?.id) {
          const imgUrl = await fetchProfileImage(userPr?.id);
          dispatch(setAvatar(imgUrl));
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    getAvatar();
  }, [userPr?.id]);

  return {
    activeTab,
    setActiveTab,
    fileInputRef,
    avatar,
    user,
    socialLinks,
    handleAvatarChange,
    handleFieldSave,
    deleteProfileImage,
  };
}
