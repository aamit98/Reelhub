import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useState, useRef } from 'react';

const TechnicalSkills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const scaleAnims = useRef({});
  const colorAnims = useRef({});

  const skillCategories = [
    {
      title: 'Backend',
      icon: '⚙️',
      color: '#3B82F6', // Blue
      skills: ['Java', 'Spring Boot', 'Node.js', 'Express', 'REST APIs', 'JWT']
    },
    {
      title: 'Databases',
      icon: '🗄️',
      color: '#10B981', // Green
      skills: ['PostgreSQL', 'MongoDB', 'SQL', 'Data Modeling']
    },
    {
      title: 'Systems & Infra',
      icon: '🖥️',
      color: '#F59E0B', // Orange
      skills: ['Linux', 'Docker', 'Networking', 'File Storage', 'Concurrency']
    },
    {
      title: 'Frontend',
      icon: '🎨',
      color: '#8B5CF6', // Purple
      skills: ['React', 'TypeScript', 'React Native']
    },
    {
      title: 'Tools',
      icon: '🔧',
      color: '#6B7280', // Grey
      skills: ['Git', 'GitHub', 'Docker Compose', 'IntelliJ', 'VS Code', 'Postman']
    }
  ];

  const getScaleAnim = (key) => {
    if (!scaleAnims.current[key]) {
      scaleAnims.current[key] = new Animated.Value(1);
    }
    return scaleAnims.current[key];
  };

  const handlePressIn = (key, color) => {
    setHoveredSkill(key);
    Animated.parallel([
      Animated.spring(scaleAnims.current[key] || getScaleAnim(key), {
        toValue: 1.15,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
    ]).start();
  };

  const handlePressOut = (key) => {
    setHoveredSkill(null);
    Animated.spring(scaleAnims.current[key] || getScaleAnim(key), {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  return (
    <View className="w-full px-4 py-8">
      <View className="items-center mb-8">
        <Text className="text-4xl font-psemibold text-white mb-2">
          Technical Skills
        </Text>
        <Text className="text-base text-gray-300 font-pregular">
          Focused on backend development and systems engineering
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between gap-4">
        {skillCategories.map((category, categoryIndex) => (
          <View
            key={categoryIndex}
            className="bg-black-200 rounded-2xl p-5 mb-4"
            style={{ width: '48%' }}
          >
            <View className="flex-row items-center mb-4">
              <Text className="text-3xl mr-3">{category.icon}</Text>
              <Text className="text-xl font-psemibold text-white">
                {category.title}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => {
                const key = `${categoryIndex}-${skillIndex}`;
                const isHovered = hoveredSkill === key;
                const scaleAnim = getScaleAnim(key);
                
                return (
                  <Animated.View
                    key={skillIndex}
                    style={{ transform: [{ scale: scaleAnim }] }}
                  >
                    <TouchableOpacity
                      onPressIn={() => handlePressIn(key, category.color)}
                      onPressOut={() => handlePressOut(key)}
                      activeOpacity={0.9}
                      style={[
                        styles.skillButton,
                        {
                          backgroundColor: isHovered ? category.color : 'transparent',
                          borderColor: isHovered ? category.color : '#374151',
                          borderWidth: isHovered ? 2 : 1.5,
                          shadowColor: isHovered ? category.color : 'transparent',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: isHovered ? 0.5 : 0,
                          shadowRadius: 8,
                          elevation: isHovered ? 8 : 0,
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.skillText,
                          { 
                            color: isHovered ? '#FFFFFF' : '#D1D5DB',
                            fontWeight: isHovered ? '600' : '400',
                          }
                        ]}
                      >
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skillButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
});

export default TechnicalSkills;
