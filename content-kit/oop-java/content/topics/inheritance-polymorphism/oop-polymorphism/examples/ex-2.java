class Pass { }
class LabPass extends Pass {
    private final int room;
    LabPass(int room) { this.room = room; }
    int room() { return room; }
}

class Main {
    public static void main(String[] args) {
        Pass[] passes = {new Pass(), new LabPass(12), null};
        for (Pass pass : passes) {
            if (pass instanceof LabPass lab) {
                System.out.println(lab.room());
            } else {
                System.out.println("No lab");
            }
        }
    }
}
