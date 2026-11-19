import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.BorderLayout;

class Main {
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Borrow a book");
            JPanel form = new JPanel(new GridLayout(2, 2, 8, 8));
            JTextField book = new JTextField(12);
            JLabel bookLabel = new JLabel("Book id");
            bookLabel.setLabelFor(book);
            form.add(bookLabel);
            form.add(book);
            form.add(new JLabel("Member id"));
            form.add(new JTextField(12));
            frame.add(new JLabel("Enter both ids"), BorderLayout.PAGE_START);
            frame.add(form, BorderLayout.CENTER);
            frame.add(new JButton("Borrow"), BorderLayout.PAGE_END);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
