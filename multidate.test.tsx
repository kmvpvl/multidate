import renderer from 'react-test-renderer';
import MultiDate from "./multidate";
it("test MultiDate", ()=>{
  const tmd = {
    "title": "TEST",
    "estimated": {
      "datepoint": new Date("2022-07-11T05:00:00.000+00:00"),
      "tolerance": {
        "left": 10,
        "right": 0
      }
    },
    "baseline": new Map([
      [
        "0",
        {
          "datepoint": new Date("2022-07-11T05:00:00.000+00:00"),
          "tolerance": {
            "left": 1,
            "right": 5
          }
        }
      ],
      [
        "YTDQ3",
        {
          "datepoint": new Date("2022-07-11T05:00:00.000+00:00"),
          "tolerance": {
            "left": 0,
            "right": 0
          }
        }
      ]
    ])
  };
    const c = renderer.create(
    <MultiDate {...tmd}/>
  );
});

