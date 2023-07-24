import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  // AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import ClassPage from './Component/AdminPages/ClassPage';
// import ChosseSubjects from './Component/AdminPages/ChosseSubjects';

import GroupPage from './Component/AdminPages/GroupPage';
import ListOfExams from './Component/AdminPages/ListOfExams';
import ListOfQuiz from './Component/AdminPages/ListOfQuiz';
import ExamReport from './Component/AdminPages/ExamReport';
import SolvedStudents from './Component/AdminPages/SolvedStudents';
import NotSolvedStudents from './Component/AdminPages/NotSolvedStudents';
import ExamQuestions from './Component/AdminPages/ExamQuestions';
import AddEditQuestion from './Component/AdminPages/AddEditQuestion';
import AddExam from './Component/AdminPages/AddExams';
import AddSummery from './Component/AdminPages/AddSummery';
import SummaryList from './Component/AdminPages/SummeryList';
import InstructionsList from './Component/AdminPages/InstructionsList';

import Viewer from './Component/AdminPages/Viewer';
import LateStudent from './Component/AdminPages/LateStudent';
import VideosList from './Component/AdminPages/VideoList';

import PendingStudents from './Component/AdminPages/PendingStudents';
import HomePage from './Component/AdminPages/HomePage';
import SeeMore from './Component/AdminPages/SeeMore';
import Seloved_Student_Exam from './Component/AdminPages/Seloved_Student_Exam';
import SendNotifications from './Component/AdminPages/SendNotifications';
////////////////////////////////////////////////////////////////////////////  challenges
import Generations from './Component/AdminPages/Generations';
import MainChallenges from './Component/AdminPages/MainChallenges';
import chaptersPage from './Component/AdminPages/chaptersPage';
import FinishChallenge from './Component/AdminPages/FinishChallenge';
import FinishDetails from './Component/AdminPages/FinishDetails';
import QuestionDetails from './Component/AdminPages/QuestionDetails';
import TopRatedStudent from './Component/AdminPages/TopRatedStudent';
import ChapterQuestions from './Component/AdminPages/ChapterQuestions';
import AddEditQuestionToChapter from './Component/AdminPages/AddEditQuestionToChapter';
// import SwitchControle from './Component/AdminPages/SwitchControle';

import UpdateProfile from './Component/AdminPages/UpdateProfile';
import Students from './Component/AdminPages/Students';
import {createStackNavigator} from 'react-navigation-stack';
import TopPage from './Component/AdminPages/TopPage';
import TopPageWeekly from './Component/AdminPages/TopPageWeekly';

// import {View, Text, Image, StyleSheet, Button} from 'react-native';
// import {} from 'native-base'
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
// import {createDrawerNavigator} from 'react-navigation-drawer';
import Chains from './Component/AdminPages/Chains';
import ChainDetails from './Component/AdminPages/ChainDetails';
import AddVidSummary from './Component/AdminPages/AddVidSummary';
import VidQuestion from './Component/AdminPages/VidQuestion';
import AddVidQuestion from './Component/AdminPages/AddVidQuestion';
import AddInstruction from './Component/AdminPages/AddInstruction';
import CardsInquiries from './Component/AdminPages/CardsInquiries';
import BubbleExamQuestions from './Component/AdminPages/BubbleExamQuestions';
import 'moment/locale/ar';
import {
  Login,
  ScanOrSearch,
  SearchStudents,
  StudentAccount,
  StudentSubHistory,
  HistoryGenerations,
  HistoryCollection,
  PaymentHistory,
  CollectionMonths,
  FinanceUsers,
  FinanceUsersMonth,
  AdminPaymentRecords,
  Months,
} from './Component/AdminPages/accounts';

class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
}

const HomePages = createStackNavigator(
  {
    // ChosseSubjects: {
    //   screen: ChosseSubjects,
    // },
    HomePage: {
      screen: HomePage,
    },
    ClassPage: {
      screen: ClassPage,
    },
    GroupPage: {
      screen: GroupPage,
    },
    ListOfExams: {
      screen: ListOfExams,
    },
    ListOfQuiz: {
      screen: ListOfQuiz,
    },
    PendingStudents: {
      screen: PendingStudents,
    },
    Students: {
      screen: Students,
    },
    UpdateProfile: {
      screen: UpdateProfile,
    },
    CardsInquiries: {
      screen: CardsInquiries,
    },
    SeeMore: {
      screen: SeeMore,
    },
    ExamReport: {
      screen: ExamReport,
    },
    SolvedStudents: {
      screen: SolvedStudents,
    },
    NotSolvedStudents: {
      screen: NotSolvedStudents,
    },

    AddEditQuestion: {
      screen: AddEditQuestion,
    },
    AddExam: {
      screen: AddExam,
    },
    ExamQuestions: {
      screen: ExamQuestions,
    },
    AddSummery: {
      screen: AddSummery,
    },
    SummaryList: {
      screen: SummaryList,
    },
    InstructionsList: {
      screen: InstructionsList,
    },
    AddInstruction: {
      screen: AddInstruction,
    },
    Viewer: {
      screen: Viewer,
    },
    Seloved_Student_Exam: {
      screen: Seloved_Student_Exam,
    },
    LateStudent: {
      screen: LateStudent,
    },
    VideosList: {
      screen: VideosList,
    },
    SendNotifications: {
      screen: SendNotifications,
    },
    //
    Generations: {
      screen: Generations,
    },
    MainChallenges: {
      screen: MainChallenges,
    },
    chaptersPage: {
      screen: chaptersPage,
    },
    FinishChallenge: {
      screen: FinishChallenge,
    },
    FinishDetails: {
      screen: FinishDetails,
    },
    QuestionDetails: {
      screen: QuestionDetails,
    },
    TopRatedStudent: {
      screen: TopRatedStudent,
    },
    TopPage: {
      screen: TopPage,
    },
    TopPageWeekly: {
      screen: TopPageWeekly,
    },
    ChapterQuestions: {
      screen: ChapterQuestions,
    },
    AddEditQuestionToChapter: {
      screen: AddEditQuestionToChapter,
    },
    Chains: {
      screen: Chains,
    },
    ChainDetails: {
      screen: ChainDetails,
    },
    AddVidSummary: {
      screen: AddVidSummary,
    },
    VidQuestion: {
      screen:  VidQuestion,
    },
    AddVidQuestion: {
      screen:  AddVidQuestion,
    },
   
    BubbleExamQuestions: {
      screen: BubbleExamQuestions,
    },
    // accounts
    Login: {
      screen: Login,
    },
    ScanOrSearch: {
      screen: ScanOrSearch,
    },
    SearchStudents: {
      screen: SearchStudents,
    },
    StudentAccount: {
      screen: StudentAccount,
    },
    StudentSubHistory: {
      screen: StudentSubHistory,
    },
    HistoryGenerations: {
      screen: HistoryGenerations,
    },
    HistoryCollection: {
      screen: HistoryCollection,
    },
    CollectionMonths: {
      screen: CollectionMonths,
    },
    PaymentHistory: {
      screen: PaymentHistory,
    },
    FinanceUsers: {
      screen: FinanceUsers,
    },
    FinanceUsersMonth: {
      screen: FinanceUsersMonth,
    },
    AdminPaymentRecords: {
      screen: AdminPaymentRecords,
    },
    Months: {
      screen: Months,
    },
  },
  {headerMode: 'none'},
);

export default createAppContainer(
  createSwitchNavigator(
    {
      // App: SummaryList,
      // App: ChosseSubjects,

      HomePages: HomePages,
    },
    {
      initialRouteName: 'HomePages',
    },
  ),
);
