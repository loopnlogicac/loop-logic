class Parent { Parent() { System.out.println("P"); } }
class Child extends Parent { Child() { System.out.println("C"); } }

class Main {
    public static void main(String[] args) throws Exception {
        new Child();
    }
}
