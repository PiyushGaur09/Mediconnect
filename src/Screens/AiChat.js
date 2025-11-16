import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AiChat = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'light';

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi there! I am your Health Assistant. Please describe your symptoms and I will help you with screening.',
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentScreeningId, setCurrentScreeningId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [screeningComplete, setScreeningComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingAnimation] = useState(new Animated.Value(0));

  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const startTypingAnimation = () => {
    typingAnimation.setValue(0);
    Animated.timing(typingAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const addMessageWithTyping = (message, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(true);
        startTypingAnimation();

        const tempId = Date.now();
        const tempMessage = {...message, id: tempId, text: '', isUser: false};

        setMessages(prev => [...prev, tempMessage]);

        let typedText = '';
        let i = 0;
        const interval = setInterval(() => {
          if (i < message.text.length) {
            typedText += message.text[i];
            i++;
            setMessages(prev =>
              prev.map(m => (m.id === tempId ? {...m, text: typedText} : m)),
            );
          } else {
            clearInterval(interval);
            setIsTyping(false);
            resolve();
          }
        }, 25);
      }, delay);
    });
  };

  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user_data');
      return userDataString ? JSON.parse(userDataString) : null;
    } catch {
      return null;
    }
  };

  const startScreening = async symptoms => {
    setIsLoading(true);
    try {
      const user = await getUserData();
      const patientId = user?.id || 'default-id';

      const res = await fetch(
        'https://mediconnect-lemon.vercel.app/api/screening',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            patient_id: patientId,
            initial_symptoms: symptoms,
          }),
        },
      );

      const data = await res.json();

      if (data.status && data.screening_id && data.next_question) {
        setCurrentScreeningId(data.screening_id);
        setCurrentQuestion(data.next_question);
        setCurrentStage(data.stage);

        await addMessageWithTyping({
          text: 'I understand your symptoms. Let me ask you a few questions to better assess your condition.',
          type: 'text',
        });

        await addMessageWithTyping({
          text: data.next_question.text,
          type:
            data.next_question.type === 'choice' ? 'question' : 'text_question',
          questionId: data.next_question.id,
          choices: data.next_question.choices || [],
        });
      } else {
        await addMessageWithTyping({
          text: "Sorry, I couldn't start the screening process. Please try again.",
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      await addMessageWithTyping({
        text: "I'm having trouble connecting to the server. Please try again later.",
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async answer => {
    setIsLoading(true);
    try {
      const res = await fetch(
        'https://mediconnect-lemon.vercel.app/api/screening/answer',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            screening_id: currentScreeningId,
            answer: answer,
          }),
        },
      );

      const data = await res.json();

      if (data.status && data.stage < 6) {
        // More questions to ask
        setCurrentQuestion(data.next_question);
        setCurrentStage(data.stage);

        await addMessageWithTyping({
          text: data.next_question.text,
          type:
            data.next_question.type === 'choice' ? 'question' : 'text_question',
          questionId: data.next_question.id,
          choices: data.next_question.choices || [],
        });
      } else if (data.status && data.stage === 6) {
        // Screening complete - show analysis
        setScreeningComplete(true);
        setCurrentQuestion(null);

        await addMessageWithTyping({
          text: `Based on your symptoms, here's my analysis:\n\n${
            data.analysis?.summary || 'No analysis available.'
          }`,
          type: 'analysis',
        });

        if (data.analysis?.probable_diagnoses?.length) {
          const diag = data.analysis.probable_diagnoses
            .map(d => `${d.name} (${(d.confidence * 100).toFixed(0)}%)`)
            .join('\n');
          await addMessageWithTyping({
            text: `Probable Diagnoses:\n${diag}`,
            type: 'diagnoses',
          });
        }

        if (data.analysis?.recommended_medicines?.length) {
          const meds = data.analysis.recommended_medicines
            .map(m => `${m.name} – ${m.dose}\n${m.notes}`)
            .join('\n\n');
          await addMessageWithTyping({
            text: `Recommended Medicines:\n${meds}`,
            type: 'medicines',
          });
        }

        const recs = [];
        if (data.analysis?.recommended_specialties?.length)
          recs.push(
            `Specialties: ${data.analysis.recommended_specialties.join(', ')}`,
          );
        if (data.analysis?.recommended_lab_tests?.length)
          recs.push(
            `Lab Tests: ${data.analysis.recommended_lab_tests.join(', ')}`,
          );
        if (data.analysis?.urgency)
          recs.push(`Urgency: ${data.analysis.urgency}`);

        if (recs.length)
          await addMessageWithTyping({
            text: `Recommendations:\n${recs.join('\n')}`,
            type: 'recommendations',
          });

        await addMessageWithTyping({
          text: 'Would you like me to find doctors based on your condition?',
          type: 'doctor_suggestion',
        });
      } else {
        await addMessageWithTyping({
          text: 'There was an issue with the screening. Please try again.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      await addMessageWithTyping({
        text: 'Error submitting answer. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserResponse = async answer => {
    // Add user message only once here
    const userMsg = {
      id: Date.now(),
      text: answer,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);

    await submitAnswer(answer);
  };

  const handleChoiceSelection = async choice => {
    // Add user message for choice selection
    const userMsg = {
      id: Date.now(),
      text: choice,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);

    await submitAnswer(choice);
  };

  const findDoctors = async () => {
    if (!currentScreeningId) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://mediconnect-lemon.vercel.app/api/screening/${currentScreeningId}/doctors`,
      );
      const data = await res.json();

      if (data.success && data.data) {
        if (data.data.doctors?.length > 0) {
          await addMessageWithTyping({
            text: `I found ${data.data.doctors.length} doctor(s) for you.`,
            type: 'doctor_results',
          });
          setTimeout(() => {
            navigation.navigate('AllDoctorsList', {
              screeningData: data.data,
              screeningId: currentScreeningId,
            });
          }, 1500);
        } else {
          await addMessageWithTyping({
            text: data.message || 'No doctors found for these specialties.',
            type: 'no_doctors',
          });
        }
      } else {
        await addMessageWithTyping({
          text: 'Failed to fetch doctors list.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      await addMessageWithTyping({
        text: 'Error finding doctors. Try again later.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindDoctors = () => {
    findDoctors();
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    
    // Add user message only once
    const msg = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, msg]);
    setInputText('');

    if (!currentScreeningId) {
      // Start new screening
      await startScreening(text);
    } else if (currentQuestion && !screeningComplete) {
      // Answer current question - don't add another message here
      await submitAnswer(text);
    }
  };

  const renderMessage = message => {
    const bubbleStyle = [
      styles.messageBubble,
      message.isUser ? styles.userBubble : styles.aiBubble,
      isDarkMode &&
        (message.isUser ? styles.userBubbleDark : styles.aiBubbleDark),
    ];
    const textStyle = [
      styles.messageText,
      message.isUser ? styles.userText : styles.aiText,
      isDarkMode && (message.isUser ? styles.userTextDark : styles.aiTextDark),
    ];

    if (message.type === 'question') {
      return (
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
          <View style={styles.choicesContainer}>
            {message.choices.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.choiceButton,
                  isDarkMode && styles.choiceButtonDark,
                ]}
                onPress={() => handleChoiceSelection(c)}
                disabled={isLoading}>
                <Text
                  style={[
                    styles.choiceText,
                    isDarkMode && styles.choiceTextDark,
                  ]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (message.type === 'text_question') {
      return (
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
          <Text
            style={[
              styles.instructionText,
              isDarkMode && styles.instructionTextDark,
            ]}>
            Please type your answer below.
          </Text>
        </View>
      );
    }

    if (message.type === 'doctor_suggestion') {
      return (
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
          <TouchableOpacity
            style={styles.doctorButton}
            onPress={handleFindDoctors}
            disabled={isLoading}>
            <Text style={styles.doctorButtonText}>Find Doctors</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (
      message.type === 'analysis' ||
      message.type === 'diagnoses' ||
      message.type === 'medicines' ||
      message.type === 'recommendations'
    ) {
      return (
        <View style={bubbleStyle}>
          <Text style={textStyle}>{message.text}</Text>
        </View>
      );
    }

    return (
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={[
              styles.backButtonText,
              isDarkMode && styles.backButtonTextDark,
            ]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>
          Health Assistant
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }>
        {messages.map(m => (
          <View key={m.id}>{renderMessage(m)}</View>
        ))}
        {(isLoading || isTyping) && (
          <View
            style={[
              styles.messageBubble,
              styles.aiBubble,
              isDarkMode && styles.aiBubbleDark,
            ]}>
            <ActivityIndicator size="small" color="#7E57C2" />
            <Text
              style={[styles.typingText, isDarkMode && styles.typingTextDark]}>
              Health Assistant is thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.inputContainer,
          isDarkMode && styles.inputContainerDark,
        ]}>
        <TextInput
          style={[styles.textInput, isDarkMode && styles.textInputDark]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type here..."
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          multiline
          editable={
            !isLoading && !isTyping && currentQuestion?.type !== 'choice'
          }
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={
            !inputText.trim() || isLoading || currentQuestion?.type === 'choice'
          }>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  containerDark: {backgroundColor: '#121212'},
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerDark: {backgroundColor: '#1E1E1E', borderColor: '#333'},
  backButtonText: {fontSize: 30, color: '#000', marginRight: 10},
  backButtonTextDark: {color: '#fff'},
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#000',paddingTop:15},
  headerTitleDark: {color: '#fff'},
  chatContainer: {flex: 1},
  chatContent: {padding: 16},
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '85%',
  },
  aiBubble: {alignSelf: 'flex-start', backgroundColor: '#f2f2f2'},
  aiBubbleDark: {backgroundColor: '#2D2D2D'},
  userBubble: {alignSelf: 'flex-end', backgroundColor: '#7E57C2'},
  userBubbleDark: {backgroundColor: '#7E57C2'},
  messageText: {fontSize: 16},
  aiText: {color: '#000'},
  aiTextDark: {color: '#fff'},
  userText: {color: '#fff'},
  userTextDark: {color: '#fff'},
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  choiceButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  choiceButtonDark: {backgroundColor: '#333', borderColor: '#555'},
  choiceText: {color: '#000'},
  choiceTextDark: {color: '#fff'},
  instructionText: {fontSize: 12, color: '#666', marginTop: 5},
  instructionTextDark: {color: '#999'},
  doctorButton: {
    marginTop: 10,
    backgroundColor: '#7E57C2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  doctorButtonText: {color: '#fff', fontWeight: '600'},
  typingText: {marginLeft: 8, color: '#777', fontStyle: 'italic'},
  typingTextDark: {color: '#999'},
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputContainerDark: {backgroundColor: '#1E1E1E', borderColor: '#333'},
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    color: '#000',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
  },
  textInputDark: {color: '#fff', backgroundColor: '#2D2D2D'},
  sendButton: {
    backgroundColor: '#7E57C2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {opacity: 0.6},
  sendButtonText: {color: '#fff', fontWeight: '600'},
});

export default AiChat;