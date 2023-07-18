import { Fragment, useEffect, useState } from "react";
import ImageButton from "./ImageButton";

export default function TourImages({
  tourData,
  setTourData,
  images,
  setImages,
}) {
  const [imgCoverPreview, setImgCoverPreview] = useState();
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    if (!tourData.imageCover) {
      setImgCoverPreview(undefined);
      return;
    }

    if (typeof tourData?.imageCover === "string") {
      setImgCoverPreview(tourData.imageCover);
      return;
    }

    const objectUrl = URL.createObjectURL(tourData.imageCover);
    setImgCoverPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [tourData]);

  useEffect(() => {
    if (!images) {
      setImagesPreview(undefined);
      return;
    }

    const objects = images.map((el) =>
      typeof el === "string" ? el : URL.createObjectURL(el)
    );
    setImagesPreview(objects);

    return () =>
      objects.forEach(
        (el) => typeof el !== "string" && URL.revokeObjectURL(el)
      );
  }, [images]);

  const imageCoverHandler = (e) => {
    setTourData((prevState) => ({
      ...prevState,
      imageCover: e.target.files[0],
    }));
  };

  const deleteImageCover = () => {
    setTourData((prevState) => ({ ...prevState, imageCover: "" }));
  };

  const imagesHandler = (e) => {
    if (images.length >= 3) return;

    const selectedImages = [...Array(e.target.files.length)].map(
      (el, index) => e.target.files[index]
    );
    setImages((prevState) => [...prevState, ...selectedImages]);
  };

  const deleteImageHandler = (index) => {
    setImages((prevState) => prevState.filter((el, i) => i !== index));
  };

  return (
    <Fragment>
      <div className="form__photo-upload span-all-columns">
        <p className="tourform-sub-heading ma-r-sm">Tour Cover Image:</p>
        <input
          className="form__upload"
          name="imageCover"
          id="imageCover"
          type="file"
          accept="image/*"
          onChange={imageCoverHandler}
        />
        <label className="form__label ma-r-lg" htmlFor="imageCover">
          Choose Single
        </label>
        {imgCoverPreview && (
          <ImageButton src={imgCoverPreview} onClick={deleteImageCover} />
        )}
      </div>
      <div className="form__group form__photo-upload span-all-columns">
        <p className="tourform-sub-heading ma-r-sm">
          Other Tour Images (Maximum 3):
        </p>

        <input
          className="form__upload"
          name="images"
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={imagesHandler}
        />
        <label className="form__label" htmlFor="images">
          Choose Multiple
        </label>
      </div>
      <div className="span-all-columns ma-t-md flex">
        {imagesPreview.map((el, index) => (
          <ImageButton
            key={index}
            src={el}
            onClick={deleteImageHandler.bind(null, index)}
          />
        ))}
      </div>
    </Fragment>
  );
}
