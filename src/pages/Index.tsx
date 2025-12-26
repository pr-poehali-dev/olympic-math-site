import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const tasks = [
    {
      id: 1,
      question: 'У Маши было 15 конфет. Она съела 7 конфет. Сколько конфет осталось?',
      correctAnswer: '8',
      points: 5
    },
    {
      id: 2,
      question: 'В классе 12 мальчиков и 14 девочек. Сколько всего детей в классе?',
      correctAnswer: '26',
      points: 5
    },
    {
      id: 3,
      question: 'Сколько будет 9 × 8?',
      correctAnswer: '72',
      points: 10
    },
    {
      id: 4,
      question: 'На полке стояло 24 книги. После того, как несколько книг взяли, осталось 18. Сколько книг взяли?',
      correctAnswer: '6',
      points: 10
    },
    {
      id: 5,
      question: 'Периметр квадрата 20 см. Чему равна длина одной стороны?',
      correctAnswer: '5',
      points: 15
    }
  ];

  const handleAnswerChange = (taskId: number, value: string) => {
    setAnswers({ ...answers, [taskId]: value });
  };

  const checkAnswers = () => {
    let correct = 0;
    let totalPoints = 0;
    
    tasks.forEach(task => {
      if (answers[task.id] === task.correctAnswer) {
        correct++;
        totalPoints += task.points;
      }
    });

    toast({
      title: `Результат: ${correct} из ${tasks.length}`,
      description: `Вы набрали ${totalPoints} баллов!`,
    });
  };

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Регистрация принята!',
      description: 'Мы отправим вам информацию об оплате на указанный email.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Icon name="Calculator" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                МатОлимп
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1">
            <TabsTrigger value="home" className="text-base py-3">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-base py-3">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Задания
            </TabsTrigger>
            <TabsTrigger value="register" className="text-base py-3">
              <Icon name="UserPlus" size={18} className="mr-2" />
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge className="bg-secondary text-white text-lg px-4 py-2">
                    Для учеников 3 класса
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Математическая Олимпиада 2025
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Проверь свои знания математики и получи призы! Интересные задачи, 
                  увлекательные головоломки и возможность стать чемпионом среди одноклассников.
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedTab('register')}
                >
                  Участвовать в олимпиаде
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="https://cdn.poehali.dev/projects/79469bb5-5139-4af1-9091-0c417b5e1409/files/9829ef50-cab8-4508-a31e-e0c359172b07.jpg"
                  alt="Математическая олимпиада"
                  className="rounded-3xl shadow-2xl w-full"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                    <Icon name="Trophy" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Призы победителям</CardTitle>
                  <CardDescription className="text-base">
                    Дипломы, подарки и сертификаты для лучших участников
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-accent/20 hover:border-accent/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-2">
                    <Icon name="Brain" size={24} className="text-accent" />
                  </div>
                  <CardTitle className="text-2xl">45 баллов</CardTitle>
                  <CardDescription className="text-base">
                    5 интересных задач разного уровня сложности
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-2">
                    <Icon name="Clock" size={24} className="text-secondary" />
                  </div>
                  <CardTitle className="text-2xl">45 минут</CardTitle>
                  <CardDescription className="text-base">
                    Время на выполнение всех заданий олимпиады
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary to-accent text-white border-0">
              <CardHeader>
                <CardTitle className="text-3xl text-white">Стоимость участия</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-5xl font-bold">299 ₽</span>
                    <div className="text-base">
                      <div>Доступ ко всем заданиям</div>
                      <div>Проверка результатов</div>
                      <div>Электронный диплом</div>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">Задания олимпиады</h2>
              <p className="text-xl text-muted-foreground">
                Реши все задачи и получи максимальный балл! Для участия в олимпиаде необходима регистрация.
              </p>
            </div>

            {tasks.map((task, index) => (
              <Card key={task.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {task.points} баллов
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl leading-relaxed">{task.question}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="text"
                      placeholder="Введи ответ"
                      value={answers[task.id] || ''}
                      onChange={(e) => handleAnswerChange(task.id, e.target.value)}
                      className="text-lg py-6"
                    />
                    <Button variant="outline" size="lg" className="px-8">
                      Сохранить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center pt-4">
              <Button 
                size="lg" 
                onClick={checkAnswers}
                className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent"
              >
                Проверить ответы
                <Icon name="CheckCircle" size={20} className="ml-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl">Регистрация на олимпиаду</CardTitle>
                <CardDescription className="text-lg">
                  Заполни форму и получи доступ к заданиям после оплаты
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="student-name" className="text-base">Имя и Фамилия ученика</Label>
                    <Input 
                      id="student-name" 
                      placeholder="Иван Петров" 
                      required 
                      className="text-lg py-6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="school" className="text-base">Школа и класс</Label>
                    <Input 
                      id="school" 
                      placeholder="Школа №1, 3-А класс" 
                      required 
                      className="text-lg py-6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parent-name" className="text-base">ФИО родителя</Label>
                    <Input 
                      id="parent-name" 
                      placeholder="Петров Александр Иванович" 
                      required 
                      className="text-lg py-6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email для связи</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="example@mail.ru" 
                      required 
                      className="text-lg py-6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">Телефон</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+7 (999) 123-45-67" 
                      required 
                      className="text-lg py-6"
                    />
                  </div>

                  <Card className="bg-muted/50 border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Icon name="CreditCard" size={24} className="text-primary mt-1" />
                        <div>
                          <p className="font-semibold text-lg mb-2">Оплата участия</p>
                          <p className="text-muted-foreground">
                            После отправки формы мы вышлем вам ссылку на оплату 299 ₽. 
                            Доступ к олимпиаде откроется сразу после успешной оплаты.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent"
                  >
                    Зарегистрироваться и получить ссылку на оплату
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon name="Shield" size={24} className="text-primary" />
                    <CardTitle className="text-xl">Безопасная оплата</CardTitle>
                  </div>
                  <CardDescription>
                    Защищённая платёжная система и шифрование данных
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon name="HeadphonesIcon" size={24} className="text-primary" />
                    <CardTitle className="text-xl">Поддержка 24/7</CardTitle>
                  </div>
                  <CardDescription>
                    Ответим на все вопросы по email и телефону
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">© 2025 МатОлимп. Математическая олимпиада для 3 класса</p>
            <p className="mt-2">Развиваем любовь к математике с детства 🧮</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
