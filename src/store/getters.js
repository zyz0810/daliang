const getters = {
  GradeOption: state => state.GradeOption,
  StatusOption: state => state.StatusOption,
  GrainOption: state => state.GrainOption,
  VarietyOption: state => state.VarietyOption,
  DepartOption: state => state.DepartOption,
  COMPANY_OPTION: state => state.CompanyOption,
  tabLists: state => state.permission.tabLists,
  asyncRoutes: state => state.permission.asyncRoutes
}
export default getters
