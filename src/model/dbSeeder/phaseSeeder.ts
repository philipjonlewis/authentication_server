import { PhaseModel } from "../../middleware/authorization/dbModel";

const phaseDbSeeder = async () => {
  await PhaseModel.insertMany([
    // Project 1 seed
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "3e2cbbb9-3332-4f4a-b1c3-e0d5a355f08a",
      projectReferenceId: "881079a6-fe58-4c3d-a753-8b2135a60e07",
      phaseName: "Schematic Design",
      phaseOrder: 1,
    },
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "d0f423b9-a39d-4435-9adb-8d85a11dc4a9",
      projectReferenceId: "881079a6-fe58-4c3d-a753-8b2135a60e07",
      phaseName: "Design Development",
      phaseOrder: 2,
    },
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "2c32c52d-a5dc-4517-95dd-0ed633e99a9f",
      projectReferenceId: "881079a6-fe58-4c3d-a753-8b2135a60e07",
      phaseName: "Contract Document",
      phaseOrder: 3,
    },
    // Project 2 seed
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "f413b122-4130-4e2c-8312-bf7f8b8f8188",
      projectReferenceId: "9744d4d4-290a-4b58-a274-56f760fac42b",
      phaseName: "User Experience",
      phaseOrder: 1,
    },
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "6f6c9749-b960-4b75-bc81-ceca3caba45c",
      projectReferenceId: "9744d4d4-290a-4b58-a274-56f760fac42b",
      phaseName: "User Interface",
      phaseOrder: 2,
    },
    // Project 3 seed
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "909d3fa3-887a-4f94-8327-0409ddc0bfc1",
      projectReferenceId: "727c3356-2998-4579-b602-b73df938537f",
      phaseName: "Collect Data",
      phaseOrder: 1,
    },
    {
      user: "629f16040553eb13ba470d99",
      phaseId: "df3701eb-29a2-4c77-8647-7c6038c54062",
      projectReferenceId: "727c3356-2998-4579-b602-b73df938537f",
      phaseName: "Study",
      phaseOrder: 2,
    },
  ]);
};

export default phaseDbSeeder;
