import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { convertDate } from "../../utils/date";
import Actions from "./Actions";
import Modal from "../ui/Modal";
import { useDeleteTourMutation } from "../../redux/apis/tourApi";
import { setAlert } from "../../redux/slices/userSlice";
import "./ManageTourItem.css";

export default function ManageTourItem({ tour }) {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteTour, { isLoading, error, isSuccess }] = useDeleteTourMutation();
  const leadGuide = tour.guides.find((el) => el.role === "lead-guide");

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (isSuccess) {
      dispatch(setAlert({ type: "success", msg: "Tour was deleted." }));
      setModal(false);
    }
  }, [isSuccess, error, dispatch]);

  return (
    <Fragment>
      {modal && (
        <Modal
          heading="Delete Tour"
          message={
            <>
              Do you want to delete <span>{tour.name}</span> tour permanently?
            </>
          }
          onProceed={() => deleteTour(tour._id)}
          onCancel={() => setModal(false)}
          isLoading={isLoading}
          headerClass="heading-warning"
        />
      )}
      <div className="tours-table-grid">
        <Link
          to={`/tours/${tour._id}`}
          className="table-img-item table-link-item"
        >
          <img
            className="manage-tour-img"
            src={tour.imageCover}
            alt={tour.name}
          />
          <div>
            <h3>{tour.name}</h3>
            <p>Created on {convertDate(tour.createdAt, true)}</p>
          </div>
        </Link>

        <div className="leadguide-item">
          <img src={leadGuide.photo} alt={leadGuide.name} />
          <h3>{leadGuide.name}</h3>
        </div>
        <p className="table-p-item">{tour.duration} days</p>

        <p className="table-p-item">
          <span className={tour.priceDiscount && "price-discount"}>
            ${tour.price}
          </span>{" "}
          {tour.priceDiscount && `$${tour.price - tour.priceDiscount}`} <br />
          <span className="table-span-item">(per person)</span>
        </p>

        <Actions
          onEdit={() => navigate(`/manage/tours/edit/${tour._id}`)}
          onDelete={() => setModal(true)}
        />
      </div>
    </Fragment>
  );
}
