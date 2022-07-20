const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// localhost:3000/project/recruit

// 메인화면에 보내줄 정렬이 필요없는 결과값 보내주기
router.get("/", async (req, res) => {
  const projectListDefault = await mysql.query("projectListDefault");
  res.send(projectListDefault);
});

// 프로젝트 모집
// 임의의 정렬버튼을 클릭했을때 혹은 검색했을 때, 다시 요청을 받습니다. 넘겨받는 값에따라 결과값이 바뀌어집니다.
router.post("/", async (req, res) => {
  try {
    // 정렬원하는 파람들 정의해주는 구역
    // console.log(req.body.param);
    console.log(req.query);
    // const page = req.body.param.page === undefined ? 0 : (req.body.param.page - 1) * 8;
    const page = (req.body.param.page - 1) * 8;
    const recruitStatus = req.body.param.status;
    // 정보 끌어와주는 구역
    const count = await mysql.query("getCount", [recruitStatus]);
    const projectRecruitList = await mysql.query("projectList", [
      recruitStatus,
      page
    ]); // 배열안에 차례차례 담아주기
    // 쏴주는 구역
    //console.log(projectRecruitList);
    res.send({ count, projectRecruitList }); // node express에서 숫자는 넘겨줄수 없다!!Buffer, String, object, Boolean, Array만 가능하다
  } catch (error) {
    res.send(error);
  }
});
// POST
// 모집글 작성 부분입니다. localhost:3000/project/recruitCreate
router.post("/insert", async (req, res) => {
  // const result = await mysql.query("projectInsert", req.body.param);
  // res.send(req);
  // req.body.xxxx  xxxx : front에서 작성하는 겁니다.
  res.send("haha");
});
// PUT
router.put("/update", async (req, res) => {
  res.send("/project/recruit/update 라우트 루트");
});
// DELETE
router.delete("/delete", async (req, res) => {
  res.send("/project/recruit/delete 라우트 루트");
});

// 모집글 상세 GET
router.get("/:projectId", async (req, res) => {
  let projectId = req.params.projectId;
  const projectDetail = await mysql.query("projectDetail", [projectId]);
  //console.log("실행---------------------");
  //console.log(projectDetail[0]);
  res.send(projectDetail[0]);
});

// GET
// 리더 기본정보
router.get("/:projectId/leader", async (req, res) => {
  let projectId = req.params.projectId;
  const leaderData = await mysql.query("projectLeaderData", [projectId]);
  const leaderHistory = await mysql.query("leaderHistory", [
    projectId,
    projectId
  ]);
  leaderData[0].leaderHistory = leaderHistory;
  //console.log(leaderData[0]); // leaderData 확인해보세요
  res.send(leaderData[0]);
});

// GET
// 리더 프로젝트 진행이력 ( 삭제. leaderData.leaderHistory 에 있음.)
// TODO: 데이터 추가 후 테스트 필요
router.get("/:projectId/leaderhistory", async (req, res) => {
  let projectId = req.params.projectId;
  // TODO: 질문: leaderProjectHistory 쿼리문 -> leaderHistory 이렇게 짜도 되는지.
  res.send(leaderHistory);
});

// GET
// 프로젝트 참고 링크
router.get("/:projectId/ref_url", async (req, res) => {
  let projectId = req.params.projectId;
  const refUrl = await mysql.query("projectRefUrl", [projectId]);
  res.send(refUrl);
});

// GET
// 프로젝트 모집 현황 & 인원
router.get("/:projectId/recruit_data", async (req, res) => {
  let projectId = req.params.projectId;
  // apply_dept_id 별로 값을 가짐.
  const recruitData = await mysql.query("projectRecruitData", [projectId]);
  // 각 배열을 순회하면서 apply_dept_id  기준으로 몇명 ACC 되었는지 값을 가져옴. (팀장 포함? 미포함? )
  //console.log(" recruitData 확인해보세요");
  //console.log(recruitData);
  res.send(recruitData);
});
module.exports = router; // NECCESARY END STATE
