import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { users, quizzes } from './config/mongoCollections.js';
import { hashPassword } from './helpers.js';
import { ObjectId } from 'mongodb';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const userCollection = await users();
    const quizCollection = await quizzes();

    const userData = [
        {
            firstName: "Tom",
            lastName: "Brady",
            username: "tb12",
            email: "brady@nfl.com",
            password: await hashPassword("Goat123!"),
            role: "admin",
            description: "7-time Super Bowl champion QB. Played 20 years with Patriots, finished with Bucs. The GOAT.",
            quizzesTaken: 12,
            averageScore: 95
        },
        {
            firstName: "Jerry",
            lastName: "Rice",
            username: "jerry80",
            email: "rice@nfl.com",
            password: await hashPassword("GOATWR123!"),
            role: "user",
            description: "Greatest WR of all time. Played for 49ers, Raiders, and Seahawks. All-time leader in receptions.",
            quizzesTaken: 15,
            averageScore: 88
        },
        {
            firstName: "Lawrence",
            lastName: "Taylor",
            username: "lt56",
            email: "taylor@nfl.com",
            password: await hashPassword("Giants56!"),
            role: "user",
            description: "Revolutionary linebacker for the Giants. Changed how defense was played. Most feared defender ever.",
            quizzesTaken: 8,
            averageScore: 82
        },
        {
            firstName: "Walter",
            lastName: "Payton",
            username: "sweetness",
            email: "payton@nfl.com",
            password: await hashPassword("Bears34!"),
            role: "user",
            description: "Chicago Bears legend. 'Sweetness' was known for his smooth running style and toughness.",
            quizzesTaken: 10,
            averageScore: 90
        },
        {
            firstName: "Joe",
            lastName: "Montana",
            username: "joe16",
            email: "montana@nfl.com",
            password: await hashPassword("49ers16!"),
            role: "user",
            description: "4-time Super Bowl champion QB with the 49ers. Known as 'Joe Cool' for clutch performances.",
            quizzesTaken: 14,
            averageScore: 91
        },
        {
            firstName: "Barry",
            lastName: "Sanders",
            username: "barry20",
            email: "sanders@nfl.com",
            password: await hashPassword("Lions20!"),
            role: "user",
            description: "Detroit Lions RB with incredible agility. Made defenders miss like no one else.",
            quizzesTaken: 9,
            averageScore: 85
        },
        {
            firstName: "Peyton",
            lastName: "Manning",
            username: "sheriff18",
            email: "manning@nfl.com",
            password: await hashPassword("Omaha18!"),
            role: "user",
            description: "Master of the pre-snap adjustment. Won Super Bowls with Colts and Broncos. Football genius.",
            quizzesTaken: 20,
            averageScore: 98
        },
        {
            firstName: "Randy",
            lastName: "Moss",
            username: "moss84",
            email: "moss@nfl.com",
            password: await hashPassword("Straight84!"),
            role: "user",
            description: "Revolutionary deep threat WR. Famous for 'Moss'd' becoming a verb. Straight cash homie.",
            quizzesTaken: 7,
            averageScore: 79
        },
        {
            firstName: "Ray",
            lastName: "Lewis",
            username: "ray52",
            email: "lewis@nfl.com",
            password: await hashPassword("Ravens52!"),
            role: "user",
            description: "Heart and soul of Ravens defense. Two-time Super Bowl champion. Legendary middle linebacker.",
            quizzesTaken: 11,
            averageScore: 88
        },
        {
            firstName: "Dan",
            lastName: "Marino",
            username: "dan13",
            email: "marino@nfl.com",
            password: await hashPassword("Dolphins13!"),
            role: "user",
            description: "Miami Dolphins QB with the quickest release ever. Revolutionized the passing game.",
            quizzesTaken: 13,
            averageScore: 87
        }
    ];

    const insertedUsers = [];
    for (const user of userData) {
        const result = await userCollection.insertOne({
            ...user,
            createdAt: new Date(),
            quizResults: [],
            savedQuizzes: []
        });
        insertedUsers.push(result.insertedId);
    }

    const quizData = [
        {
            title: "Super Basic Football Quiz",
            description: "Like, really really basic football stuff. A baby could pass this.",
            category: "general",
            questions: [
                {
                    question: "Does a touchdown score 6 points?",
                    correctAnswer: true,
                    explanation: "Duh! Obviously!"
                },
                {
                    question: "Is a football round like a basketball?",
                    correctAnswer: false,
                    explanation: "Bruh. Just bruh."
                }
            ]
        },
        {
            title: "Silly Stadium Facts",
            description: "The most obvious stadium questions ever. Like, seriously obvious.",
            category: "science",
            questions: [
                {
                    question: "Do NFL games usually play outdoors?",
                    correctAnswer: true,
                    explanation: "Sky exists dummy!"
                },
                {
                    question: "Is the field 500 yards long?",
                    correctAnswer: false,
                    explanation: "LOL nope nope!"
                }
            ]
        },
        {
            title: "Equipment Basics",
            description: "Questions about football gear that are ridiculously easy.",
            category: "general",
            questions: [
                {
                    question: "Do football players wear helmets?",
                    correctAnswer: true,
                    explanation: "Duh head protection!"
                },
                {
                    question: "Do players wear flip-flops during games?",
                    correctAnswer: false,
                    explanation: "Bruh so dumb!"
                }
            ]
        },
        {
            title: "Super Simple Rules",
            description: "The easiest rules questions ever. Like, ever ever.",
            category: "history",
            questions: [
                {
                    question: "Do teams need to score points to win?",
                    correctAnswer: true,
                    explanation: "Like... obviously bro!"
                },
                {
                    question: "Can you score by hitting a home run?",
                    correctAnswer: false,
                    explanation: "Wrong sport dummy!"
                }
            ]
        },
        {
            title: "Position Names",
            description: "Basic questions about football positions a toddler could answer.",
            category: "general",
            questions: [
                {
                    question: "Is the Quarterback usually the one who throws the ball?",
                    correctAnswer: true,
                    explanation: "Duh throw ball!"
                },
                {
                    question: "Is the Center a basketball position?",
                    correctAnswer: false,
                    explanation: "Nah bro nah!"
                }
            ]
        },
        {
            title: "Football Numbers",
            description: "Math so easy it barely counts as math.",
            category: "math",
            questions: [
                {
                    question: "Is 7 more points than 3 points?",
                    correctAnswer: true,
                    explanation: "Basic math bruh!"
                },
                {
                    question: "Do quarters last 2 hours each?",
                    correctAnswer: false,
                    explanation: "LOL so wrong!"
                }
            ]
        },
        {
            title: "Team Basics",
            description: "Questions about teams that are almost too easy to ask.",
            category: "general",
            questions: [
                {
                    question: "Do NFL teams have mascots?",
                    correctAnswer: true,
                    explanation: "Duh mascot fun!"
                },
                {
                    question: "Does each team have 100 players on the field?",
                    correctAnswer: false,
                    explanation: "Too many dude!"
                }
            ]
        },
        {
            title: "Weather and Football",
            description: "The most obvious weather-related football questions possible.",
            category: "science",
            questions: [
                {
                    question: "Do they play football in the rain?",
                    correctAnswer: true,
                    explanation: "Rain no problem!"
                },
                {
                    question: "Do they cancel games if it's sunny?",
                    correctAnswer: false,
                    explanation: "Sun good bro!"
                }
            ]
        },
        {
            title: "Fan Knowledge",
            description: "Questions about being a football fan that are super duper easy.",
            category: "general",
            questions: [
                {
                    question: "Do fans cheer when their team scores?",
                    correctAnswer: true,
                    explanation: "Yay team yay!"
                },
                {
                    question: "Do fans bring beds to sleep during games?",
                    correctAnswer: false,
                    explanation: "Wake up dummy!"
                }
            ]
        },
        {
            title: "Super Bowl History",
            description: "The easiest possible questions about the Super Bowl.",
            category: "history",
            questions: [
                {
                    question: "Is the Super Bowl the final game of the season?",
                    correctAnswer: true,
                    explanation: "Big game duh!"
                },
                {
                    question: "Is the Super Bowl played in July?",
                    correctAnswer: false,
                    explanation: "Wrong month bro!"
                }
            ]
        }
    ];

    for (const quiz of quizData) {
        await quizCollection.insertOne({
            ...quiz,
            createdBy: insertedUsers[Math.floor(Math.random() * insertedUsers.length)],
            createdAt: new Date(),
            active: true
        });
    }

    console.log('Database seeded success! 🏈');
    await closeConnection();
};

main().catch(console.error);