import OverviewBox from "./OverviewBox";
import OverviewBoxItem from "./OverviewBoxItem";
import "./TourDescription.css";

export default function TourDescription({
  startDate,
  difficulty,
  maxGroupSize,
  ratingsAverage,
  guides,
  name,
  description,
}) {
  const paragraphs = description.split("\n");

  return (
    <section className="section-description">
      <div className="overview-box">
        <div>
          <OverviewBox heading="Quick facts">
            <OverviewBoxItem
              icon="calendar"
              label="Next Date"
              text={startDate}
            />
            <OverviewBoxItem
              icon="trending-up"
              label="Difficulty"
              text={difficulty}
            />
            <OverviewBoxItem
              icon="user"
              label="Participants"
              text={`${maxGroupSize} people`}
            />
            <OverviewBoxItem
              icon="star"
              label="Rating"
              text={`${ratingsAverage} / 5`}
            />
          </OverviewBox>
          <OverviewBox heading="Your tour guides">
            {guides.map((guide) => (
              <OverviewBoxItem
                key={guide._id}
                photo={guide.photo}
                label={guide.role === "guide" ? "Tour-Guide" : guide.role}
                text={guide.name}
              />
            ))}
          </OverviewBox>
        </div>
      </div>

      <div className="description-box">
        <h2 className="heading-secondary ma-bt-lg">About {name}</h2>
        {paragraphs.map((text, index) => (
          <p key={index} className="description__text">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
