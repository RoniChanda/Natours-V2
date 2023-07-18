import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { convertDate } from "../../utils/date";
import Actions from "./Actions";
import Modal from "../ui/Modal";
import { useDeleteTourMutation } from "../../redux/apis/tourApi";
import Alert from "../ui/Alert";
import "./ManageTourItem.css";

export default function ManageTourItem({ tour }) {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const [deleteTour, { isLoading, error, data }] = useDeleteTourMutation();
  const leadGuide = tour.guides.find((el) => el.role === "lead-guide");

  useEffect(() => {
    if (data?.status === "SUCCESS") setModal(false);
  }, [data]);

  const editHandler = () => {
    navigate(`/manage/tours/edit/${tour._id}`);
  };

  return (
    <Fragment>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

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

        <Actions onEdit={editHandler} onDelete={() => setModal(true)} />
      </div>
    </Fragment>
  );
}
