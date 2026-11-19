import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;



class Main {
    public static void main(String[] args) throws Exception {
        Path path = Files.createTempFile("marks-", ".txt");
        try {
            Files.writeString(path, "40\n80\n", StandardCharsets.UTF_8);
            String text = Files.readString(path, StandardCharsets.UTF_8);
            System.out.print(text);
        } finally {
            Files.deleteIfExists(path);
        }
    }
}
